package com.restaurant.tablemgmt.dto;

import com.restaurant.tablemgmt.entity.enums.TableZone;

public class TableUtilizationDTO {
    private Long tableId;
    private String tableNumber;
    private Integer capacity;
    private TableZone locationZone;
    private long totalSessions;
    private long totalDiningMinutes;
    private double avgDurationMinutes;

    public TableUtilizationDTO() {}

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public TableZone getLocationZone() {
        return locationZone;
    }

    public void setLocationZone(TableZone locationZone) {
        this.locationZone = locationZone;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public long getTotalDiningMinutes() {
        return totalDiningMinutes;
    }

    public void setTotalDiningMinutes(long totalDiningMinutes) {
        this.totalDiningMinutes = totalDiningMinutes;
    }

    public double getAvgDurationMinutes() {
        return avgDurationMinutes;
    }

    public void setAvgDurationMinutes(double avgDurationMinutes) {
        this.avgDurationMinutes = avgDurationMinutes;
    }
}

