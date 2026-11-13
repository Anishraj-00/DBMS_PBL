package com.restaurant.tablemgmt.service;

import com.restaurant.tablemgmt.dto.DashboardStatsDTO;
import com.restaurant.tablemgmt.dto.TableUtilizationDTO;
import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.repository.OccupancySessionRepository;
import com.restaurant.tablemgmt.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final RestaurantTableRepository tableRepository;
    private final OccupancySessionRepository sessionRepository;

    public AnalyticsService(RestaurantTableRepository tableRepository,
                            OccupancySessionRepository sessionRepository) {
        this.tableRepository = tableRepository;
        this.sessionRepository = sessionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        List<RestaurantTable> allTables = tableRepository.findByIsActiveTrueOrderByTableNumberAsc();
        long total = allTables.size();

        long available = allTables.stream().filter(t -> t.getStatus() == TableStatus.AVAILABLE).count();
        long occupied = allTables.stream().filter(t -> t.getStatus() == TableStatus.OCCUPIED).count();
        long cleaning = allTables.stream().filter(t -> t.getStatus() == TableStatus.CLEANING).count();
        long reserved = allTables.stream().filter(t -> t.getStatus() == TableStatus.RESERVED).count();

        Long activeDiners = sessionRepository.countActiveDiners();
        Double avgDuration = sessionRepository.calculateAverageDiningMinutes();

        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalTables(total);
        dto.setAvailableTables(available);
        dto.setOccupiedTables(occupied);
        dto.setCleaningTables(cleaning);
        dto.setReservedTables(reserved);
        dto.setActiveDiners(activeDiners != null ? activeDiners : 0);
        dto.setAverageDiningMinutes(avgDuration != null ? Math.round(avgDuration * 10.0) / 10.0 : 0.0);

        double occupancyPct = total > 0 ? ((double) occupied / total) * 100.0 : 0.0;
        dto.setOccupancyPercentage(Math.round(occupancyPct * 10.0) / 10.0);

        return dto;
    }

    @Transactional(readOnly = true)
    public List<TableUtilizationDTO> getTableUtilization() {
        List<RestaurantTable> allTables = tableRepository.findByIsActiveTrueOrderByTableNumberAsc();
        List<TableUtilizationDTO> list = new ArrayList<>();

        for (RestaurantTable table : allTables) {
            TableUtilizationDTO dto = new TableUtilizationDTO();
            dto.setTableId(table.getId());
            dto.setTableNumber(table.getTableNumber());
            dto.setCapacity(table.getCapacity());
            dto.setLocationZone(table.getLocationZone());

            long sessions = sessionRepository.countCompletedSessionsByTableId(table.getId());
            long totalMinutes = sessionRepository.sumDiningMinutesByTableId(table.getId());
            double avgMinutes = sessions > 0 ? (double) totalMinutes / sessions : 0.0;

            dto.setTotalSessions(sessions);
            dto.setTotalDiningMinutes(totalMinutes);
            dto.setAvgDurationMinutes(Math.round(avgMinutes * 10.0) / 10.0);

            list.add(dto);
        }

        return list;
    }
}

