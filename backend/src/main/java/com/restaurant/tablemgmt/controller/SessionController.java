package com.restaurant.tablemgmt.controller;

import com.restaurant.tablemgmt.dto.SessionResponseDTO;
import com.restaurant.tablemgmt.entity.TableStatusLog;
import com.restaurant.tablemgmt.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<SessionResponseDTO> checkoutSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.checkoutSession(id));
    }

    @PostMapping("/tables/{tableId}/checkout")
    public ResponseEntity<SessionResponseDTO> checkoutByTableId(@PathVariable Long tableId) {
        return ResponseEntity.ok(sessionService.checkoutByTableId(tableId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<SessionResponseDTO>> getActiveSessions() {
        return ResponseEntity.ok(sessionService.getActiveSessions());
    }

    @GetMapping
    public ResponseEntity<List<SessionResponseDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<TableStatusLog>> getRecentStatusLogs() {
        return ResponseEntity.ok(sessionService.getRecentStatusLogs());
    }

    @GetMapping("/tables/{tableId}/logs")
    public ResponseEntity<List<TableStatusLog>> getTableStatusLogs(@PathVariable Long tableId) {
        return ResponseEntity.ok(sessionService.getStatusLogsForTable(tableId));
    }
}

