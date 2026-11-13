package com.restaurant.tablemgmt.service;

import com.restaurant.tablemgmt.dto.SessionResponseDTO;
import com.restaurant.tablemgmt.entity.OccupancySession;
import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.TableStatusLog;
import com.restaurant.tablemgmt.entity.enums.SessionStatus;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.exception.ResourceNotFoundException;
import com.restaurant.tablemgmt.repository.OccupancySessionRepository;
import com.restaurant.tablemgmt.repository.RestaurantTableRepository;
import com.restaurant.tablemgmt.repository.TableStatusLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final OccupancySessionRepository sessionRepository;
    private final RestaurantTableRepository tableRepository;
    private final TableStatusLogRepository statusLogRepository;
    private final AllocationService allocationService;

    public SessionService(OccupancySessionRepository sessionRepository,
                          RestaurantTableRepository tableRepository,
                          TableStatusLogRepository statusLogRepository,
                          AllocationService allocationService) {
        this.sessionRepository = sessionRepository;
        this.tableRepository = tableRepository;
        this.statusLogRepository = statusLogRepository;
        this.allocationService = allocationService;
    }

    /**
     * Completes dining session (Checkout):
     * 1. Sets checkout timestamp.
     * 2. Computes total dining duration in minutes.
     * 3. Transitions table status from OCCUPIED to CLEANING.
     * 4. Logs state transition to table_status_logs.
     */
    @Transactional
    public SessionResponseDTO checkoutSession(Long sessionId) {
        OccupancySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new IllegalStateException("Session is not in ACTIVE state. Current status: " + session.getStatus());
        }

        LocalDateTime now = LocalDateTime.now();
        session.setCheckOutTime(now);
        session.setStatus(SessionStatus.COMPLETED);

        long minutes = Math.max(1, Duration.between(session.getCheckInTime(), now).toMinutes());
        session.setDiningDurationMinutes((int) minutes);

        OccupancySession updatedSession = sessionRepository.save(session);

        // Transition table to CLEANING
        RestaurantTable table = session.getTable();
        TableStatus oldStatus = table.getStatus();
        table.setStatus(TableStatus.CLEANING);
        tableRepository.save(table);

        // Audit log
        statusLogRepository.save(new TableStatusLog(
                table,
                oldStatus,
                TableStatus.CLEANING,
                "Customer checkout. Dining duration: " + minutes + " minutes."
        ));

        return allocationService.toSessionResponseDTO(updatedSession);
    }

    @Transactional
    public SessionResponseDTO checkoutByTableId(Long tableId) {
        OccupancySession session = sessionRepository.findByTableIdAndStatus(tableId, SessionStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active session found for table id: " + tableId));
        return checkoutSession(session.getId());
    }

    @Transactional(readOnly = true)
    public List<SessionResponseDTO> getActiveSessions() {
        return sessionRepository.findByStatusOrderByCheckInTimeDesc(SessionStatus.ACTIVE).stream()
                .map(allocationService::toSessionResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SessionResponseDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .sorted((a, b) -> b.getCheckInTime().compareTo(a.getCheckInTime()))
                .map(allocationService::toSessionResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TableStatusLog> getRecentStatusLogs() {
        return statusLogRepository.findTop50ByOrderByChangedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<TableStatusLog> getStatusLogsForTable(Long tableId) {
        return statusLogRepository.findByTableIdOrderByChangedAtDesc(tableId);
    }
}

