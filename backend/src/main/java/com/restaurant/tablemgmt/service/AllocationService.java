package com.restaurant.tablemgmt.service;

import com.restaurant.tablemgmt.dto.AllocationRequestDTO;
import com.restaurant.tablemgmt.dto.SessionResponseDTO;
import com.restaurant.tablemgmt.entity.Customer;
import com.restaurant.tablemgmt.entity.OccupancySession;
import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.TableStatusLog;
import com.restaurant.tablemgmt.entity.User;
import com.restaurant.tablemgmt.entity.enums.AllocationType;
import com.restaurant.tablemgmt.entity.enums.SessionStatus;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.exception.ResourceNotFoundException;
import com.restaurant.tablemgmt.exception.TableAlreadyOccupiedException;
import com.restaurant.tablemgmt.repository.OccupancySessionRepository;
import com.restaurant.tablemgmt.repository.RestaurantTableRepository;
import com.restaurant.tablemgmt.repository.TableStatusLogRepository;
import com.restaurant.tablemgmt.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AllocationService {

    private final RestaurantTableRepository tableRepository;
    private final CustomerService customerService;
    private final OccupancySessionRepository sessionRepository;
    private final TableStatusLogRepository statusLogRepository;
    private final UserRepository userRepository;

    public AllocationService(RestaurantTableRepository tableRepository,
                             CustomerService customerService,
                             OccupancySessionRepository sessionRepository,
                             TableStatusLogRepository statusLogRepository,
                             UserRepository userRepository) {
        this.tableRepository = tableRepository;
        this.customerService = customerService;
        this.sessionRepository = sessionRepository;
        this.statusLogRepository = statusLogRepository;
        this.userRepository = userRepository;
    }

    /**
     * Automatic Best-Fit Table Allocation:
     * 1. Finds all AVAILABLE tables with capacity >= requested party size, ordered by capacity ASC.
     * 2. Selects the smallest suitable table to minimize seat wastage.
     * 3. Locks and allocates inside an ACID transaction to prevent concurrency conflicts.
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public SessionResponseDTO allocateAutomatically(AllocationRequestDTO request) {
        if (request.getPartySize() == null || request.getPartySize() <= 0) {
            throw new IllegalArgumentException("Party size must be greater than zero.");
        }

        // Best-fit query: capacity >= partySize sorted ASC
        List<RestaurantTable> candidateTables = tableRepository.findAvailableTablesForPartySize(request.getPartySize());

        if (candidateTables.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No available table found that can accommodate a party size of " + request.getPartySize() + "."
            );
        }

        // Select the first best-fit candidate
        RestaurantTable selectedCandidate = candidateTables.get(0);

        // Lock and allocate
        return performAllocation(selectedCandidate.getId(), request, AllocationType.AUTOMATIC);
    }

    /**
     * Manual Table Allocation:
     * Allocates a specific table explicitly chosen by the host/waiter.
     * Guarded with pessimistic database write lock to prevent race conditions.
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public SessionResponseDTO allocateManually(AllocationRequestDTO request) {
        if (request.getTableId() == null) {
            throw new IllegalArgumentException("Table ID is required for manual allocation.");
        }
        if (request.getPartySize() == null || request.getPartySize() <= 0) {
            throw new IllegalArgumentException("Party size must be greater than zero.");
        }

        return performAllocation(request.getTableId(), request, AllocationType.MANUAL);
    }

    /**
     * Core Transactional Allocation Guard:
     * Ensures ACID properties and strict concurrency prevention:
     * 1. Acquires Pessimistic Write Lock on table row.
     * 2. Validates table is not already OCCUPIED or CLEANING.
     * 3. Validates no active session exists for table.
     * 4. Updates table status to OCCUPIED.
     * 5. Saves new OccupancySession.
     * 6. Writes audit log to table_status_logs.
     */
    private SessionResponseDTO performAllocation(Long tableId, AllocationRequestDTO request, AllocationType allocationType) {
        // Lock table row (SELECT ... FOR UPDATE)
        RestaurantTable table = tableRepository.findByIdWithLock(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + tableId));

        // Capacity validation
        if (table.getCapacity() < request.getPartySize()) {
            throw new IllegalArgumentException(
                    "Selected table (" + table.getTableNumber() + ") capacity is " + table.getCapacity() + 
                    ", which is insufficient for party size of " + request.getPartySize() + "."
            );
        }

        // Status conflict validation
        if (table.getStatus() == TableStatus.OCCUPIED) {
            throw new TableAlreadyOccupiedException("Table " + table.getTableNumber() + " is already OCCUPIED.");
        }
        if (table.getStatus() == TableStatus.CLEANING) {
            throw new TableAlreadyOccupiedException("Table " + table.getTableNumber() + " is currently under CLEANING. Please sanitize first.");
        }

        // Active session check
        Optional<OccupancySession> activeCheck = sessionRepository.findByTableIdAndStatus(table.getId(), SessionStatus.ACTIVE);
        if (activeCheck.isPresent()) {
            throw new TableAlreadyOccupiedException("Table " + table.getTableNumber() + " already has an ACTIVE dining session.");
        }

        // Find or create customer
        Customer customer = customerService.findOrCreateCustomer(
                request.getCustomerId(),
                request.getCustomerName(),
                request.getCustomerPhone(),
                request.getCustomerNotes()
        );

        // Fetch staff if specified
        User staff = null;
        if (request.getStaffId() != null) {
            staff = userRepository.findById(request.getStaffId()).orElse(null);
        }

        TableStatus oldStatus = table.getStatus();

        // Transition table to OCCUPIED
        table.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(table);

        // Create Occupancy Session
        OccupancySession session = new OccupancySession();
        session.setTable(table);
        session.setCustomer(customer);
        session.setPartySize(request.getPartySize());
        session.setStatus(SessionStatus.ACTIVE);
        session.setAllocationType(allocationType);
        session.setCheckInTime(LocalDateTime.now());
        session.setStaff(staff);
        session.setNotes(request.getNotes());
        OccupancySession savedSession = sessionRepository.save(session);

        // Audit Log
        statusLogRepository.save(new TableStatusLog(
                table,
                oldStatus,
                TableStatus.OCCUPIED,
                "Check-in: " + allocationType.name() + " allocation for party of " + request.getPartySize()
        ));

        return toSessionResponseDTO(savedSession);
    }

    public SessionResponseDTO toSessionResponseDTO(OccupancySession session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setId(session.getId());
        dto.setTableId(session.getTable().getId());
        dto.setTableNumber(session.getTable().getTableNumber());
        dto.setCustomerId(session.getCustomer().getId());
        dto.setCustomerName(session.getCustomer().getFullName());
        dto.setCustomerPhone(session.getCustomer().getPhoneNumber());
        dto.setPartySize(session.getPartySize());
        dto.setStatus(session.getStatus());
        dto.setAllocationType(session.getAllocationType());
        dto.setCheckInTime(session.getCheckInTime());
        dto.setCheckOutTime(session.getCheckOutTime());
        dto.setDiningDurationMinutes(session.getDiningDurationMinutes());
        if (session.getStaff() != null) {
            dto.setStaffName(session.getStaff().getFullName());
        }
        dto.setNotes(session.getNotes());
        return dto;
    }
}

