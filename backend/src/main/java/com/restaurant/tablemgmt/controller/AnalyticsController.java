package com.restaurant.tablemgmt.controller;

import com.restaurant.tablemgmt.dto.DashboardStatsDTO;
import com.restaurant.tablemgmt.dto.TableUtilizationDTO;
import com.restaurant.tablemgmt.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/utilization")
    public ResponseEntity<List<TableUtilizationDTO>> getTableUtilization() {
        return ResponseEntity.ok(analyticsService.getTableUtilization());
    }
}

