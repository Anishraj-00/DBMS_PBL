package com.restaurant.tablemgmt.controller;

import com.restaurant.tablemgmt.dto.AllocationRequestDTO;
import com.restaurant.tablemgmt.dto.SessionResponseDTO;
import com.restaurant.tablemgmt.service.AllocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    /**
     * Automatic Allocation Endpoint:
     * Assigns the optimal available table based on party size.
     */
    @PostMapping("/auto")
    public ResponseEntity<SessionResponseDTO> allocateAutomatically(@Valid @RequestBody AllocationRequestDTO request) {
        SessionResponseDTO response = allocationService.allocateAutomatically(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Manual Allocation Endpoint:
     * Staff selects a specific table for check-in.
     */
    @PostMapping("/manual")
    public ResponseEntity<SessionResponseDTO> allocateManually(@Valid @RequestBody AllocationRequestDTO request) {
        SessionResponseDTO response = allocationService.allocateManually(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}

