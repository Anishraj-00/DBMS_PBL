package com.restaurant.tablemgmt.service;

import com.restaurant.tablemgmt.dto.TableRequestDTO;
import com.restaurant.tablemgmt.dto.TableResponseDTO;
import com.restaurant.tablemgmt.entity.OccupancySession;
import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.TableStatusLog;
import com.restaurant.tablemgmt.entity.enums.SessionStatus;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.entity.enums.TableZone;
import com.restaurant.tablemgmt.exception.InvalidStateTransitionException;
import com.restaurant.tablemgmt.exception.ResourceNotFoundException;
import com.restaurant.tablemgmt.repository.OccupancySessionRepository;
import com.restaurant.tablemgmt.repository.RestaurantTableRepository;
import com.restaurant.tablemgmt.repository.TableStatusLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TableService {

    private final RestaurantTableRepository tableRepository;
    private final OccupancySessionRepository sessionRepository;
    private final TableStatusLogRepository statusLogRepository;

    public TableService(RestaurantTableRepository tableRepository,
                        OccupancySessionRepository sessionRepository,
                        TableStatusLogRepository statusLogRepository) {
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
        this.statusLogRepository = statusLogRepository;
    }

    @Transactional(readOnly = true)
    public List<TableResponseDTO> getAllTables(TableStatus statusFilter, TableZone zoneFilter) {
        List<RestaurantTable> tables = tableRepository.findByIsActiveTrueOrderByTableNumberAsc();
        return tables.stream()
                .filter(t -> statusFilter == null || t.getStatus() == statusFilter)
                .filter(t -> zoneFilter == null || t.getLocationZone() == zoneFilter)
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TableResponseDTO getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));
        return toResponseDTO(table);
    }

    @Transactional
    public TableResponseDTO createTable(TableRequestDTO dto) {
        if (tableRepository.existsByTableNumber(dto.getTableNumber())) {
            throw new IllegalArgumentException("Table number already exists: " + dto.getTableNumber());
        }
        RestaurantTable table = new RestaurantTable(dto.getTableNumber(), dto.getCapacity(), dto.getLocationZone());
        RestaurantTable saved = tableRepository.save(table);

        // Initial status log
        statusLogRepository.save(new TableStatusLog(saved, TableStatus.AVAILABLE, TableStatus.AVAILABLE, "Initial Creation"));
        return toResponseDTO(saved);
    }

    @Transactional
    public TableResponseDTO updateTable(Long id, TableRequestDTO dto) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        if (!table.getTableNumber().equalsIgnoreCase(dto.getTableNumber()) &&
            tableRepository.existsByTableNumber(dto.getTableNumber())) {
            throw new IllegalArgumentException("Table number already in use: " + dto.getTableNumber());
        }

        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());
        table.setLocationZone(dto.getLocationZone());
        return toResponseDTO(tableRepository.save(table));
    }

    @Transactional
    public void deleteTable(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        if (table.getStatus() == TableStatus.OCCUPIED) {
            throw new IllegalStateException("Cannot delete table while it is currently OCCUPIED.");
        }

        // Soft delete
        table.setIsActive(false);
        tableRepository.save(table);
    }

    @Transactional
    public TableResponseDTO updateTableStatus(Long id, TableStatus newStatus, String reason) {
        RestaurantTable table = tableRepository.findByIdWithLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with id: " + id));

        TableStatus oldStatus = table.getStatus();
        if (oldStatus == newStatus) {
            return toResponseDTO(table);
        }

        // Validate state transitions
        validateTransition(oldStatus, newStatus);

        table.setStatus(newStatus);
        RestaurantTable updated = tableRepository.save(table);

        // Record history log
        statusLogRepository.save(new TableStatusLog(
                updated, 
                oldStatus, 
                newStatus, 
                reason != null ? reason : "Direct status update"
        ));

        return toResponseDTO(updated);
    }

    private void validateTransition(TableStatus from, TableStatus to) {
        // Enforce valid business workflow transitions
        if (from == TableStatus.OCCUPIED && to == TableStatus.AVAILABLE) {
            throw new InvalidStateTransitionException("Occupied table must go through CLEANING before becoming AVAILABLE.");
        }
        if (from == TableStatus.CLEANING && to == TableStatus.OCCUPIED) {
            throw new InvalidStateTransitionException("Table is undergoing CLEANING and must be marked AVAILABLE before occupancy.");
        }
    }

    public TableResponseDTO toResponseDTO(RestaurantTable table) {
        TableResponseDTO dto = new TableResponseDTO();
        dto.setId(table.getId());
        dto.setTableNumber(table.getTableNumber());
        dto.setCapacity(table.getCapacity());
        dto.setLocationZone(table.getLocationZone());
        dto.setStatus(table.getStatus());
        dto.setIsActive(table.getIsActive());

        if (table.getStatus() == TableStatus.OCCUPIED) {
            Optional<OccupancySession> activeSession = sessionRepository.findByTableIdAndStatus(table.getId(), SessionStatus.ACTIVE);
            activeSession.ifPresent(s -> {
                dto.setActiveSessionId(s.getId());
                dto.setActiveCustomerName(s.getCustomer().getFullName());
                dto.setActivePartySize(s.getPartySize());
                dto.setOccupiedSince(s.getCheckInTime());
            });
        }

        return dto;
    }
}

