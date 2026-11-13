package com.restaurant.tablemgmt.dto;

import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.entity.enums.TableZone;
import java.time.LocalDateTime;

public class TableResponseDTO {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private TableZone locationZone;
    private TableStatus status;
    private Boolean isActive;
    private Long activeSessionId;
    private String activeCustomerName;
    private Integer activePartySize;
    private LocalDateTime occupiedSince;

    public TableResponseDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TableStatus getStatus() {
        return status;
    }

    public void setStatus(TableStatus status) {
        this.status = status;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Long getActiveSessionId() {
        return activeSessionId;
    }

    public void setActiveSessionId(Long activeSessionId) {
        this.activeSessionId = activeSessionId;
    }

    public String getActiveCustomerName() {
        return activeCustomerName;
    }

    public void setActiveCustomerName(String activeCustomerName) {
        this.activeCustomerName = activeCustomerName;
    }

    public Integer getActivePartySize() {
        return activePartySize;
    }

    public void setActivePartySize(Integer activePartySize) {
        this.activePartySize = activePartySize;
    }

    public LocalDateTime getOccupiedSince() {
        return occupiedSince;
    }

    public void setOccupiedSince(LocalDateTime occupiedSince) {
        this.occupiedSince = occupiedSince;
    }
}

