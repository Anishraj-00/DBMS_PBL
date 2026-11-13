package com.restaurant.tablemgmt.dto;

import com.restaurant.tablemgmt.entity.enums.AllocationType;
import com.restaurant.tablemgmt.entity.enums.SessionStatus;
import java.time.LocalDateTime;

public class SessionResponseDTO {
    private Long id;
    private Long tableId;
    private String tableNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Integer partySize;
    private SessionStatus status;
    private AllocationType allocationType;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Integer diningDurationMinutes;
    private String staffName;
    private String notes;

    public SessionResponseDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public Integer getPartySize() {
        return partySize;
    }

    public void setPartySize(Integer partySize) {
        this.partySize = partySize;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public AllocationType getAllocationType() {
        return allocationType;
    }

    public void setAllocationType(AllocationType allocationType) {
        this.allocationType = allocationType;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalDateTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public Integer getDiningDurationMinutes() {
        return diningDurationMinutes;
    }

    public void setDiningDurationMinutes(Integer diningDurationMinutes) {
        this.diningDurationMinutes = diningDurationMinutes;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

