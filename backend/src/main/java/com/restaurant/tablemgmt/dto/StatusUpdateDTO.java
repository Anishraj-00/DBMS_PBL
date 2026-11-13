package com.restaurant.tablemgmt.dto;

import com.restaurant.tablemgmt.entity.enums.TableStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateDTO {

    @NotNull(message = "Status cannot be null")
    private TableStatus status;

    private String reason;

    public StatusUpdateDTO() {}

    public StatusUpdateDTO(TableStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public TableStatus getStatus() {
        return status;
    }

    public void setStatus(TableStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

