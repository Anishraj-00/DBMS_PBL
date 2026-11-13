package com.restaurant.tablemgmt.dto;

public class DashboardStatsDTO {
    private long totalTables;
    private long availableTables;
    private long occupiedTables;
    private long cleaningTables;
    private long reservedTables;
    private long activeDiners;
    private double averageDiningMinutes;
    private double occupancyPercentage;

    public DashboardStatsDTO() {}

    public long getTotalTables() {
        return totalTables;
    }

    public void setTotalTables(long totalTables) {
        this.totalTables = totalTables;
    }

    public long getAvailableTables() {
        return availableTables;
    }

    public void setAvailableTables(long availableTables) {
        this.availableTables = availableTables;
    }

    public long getOccupiedTables() {
        return occupiedTables;
    }

    public void setOccupiedTables(long occupiedTables) {
        this.occupiedTables = occupiedTables;
    }

    public long getCleaningTables() {
        return cleaningTables;
    }

    public void setCleaningTables(long cleaningTables) {
        this.cleaningTables = cleaningTables;
    }

    public long getReservedTables() {
        return reservedTables;
    }

    public void setReservedTables(long reservedTables) {
        this.reservedTables = reservedTables;
    }

    public long getActiveDiners() {
        return activeDiners;
    }

    public void setActiveDiners(long activeDiners) {
        this.activeDiners = activeDiners;
    }

    public double getAverageDiningMinutes() {
        return averageDiningMinutes;
    }

    public void setAverageDiningMinutes(double averageDiningMinutes) {
        this.averageDiningMinutes = averageDiningMinutes;
    }

    public double getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(double occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }
}

