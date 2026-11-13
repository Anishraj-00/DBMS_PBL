package com.restaurant.tablemgmt.dto;

import com.restaurant.tablemgmt.entity.enums.TableZone;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TableRequestDTO {

    @NotBlank(message = "Table number cannot be blank")
    private String tableNumber;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private TableZone locationZone = TableZone.MAIN_HALL;

    public TableRequestDTO() {}

    public TableRequestDTO(String tableNumber, Integer capacity, TableZone locationZone) {
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.locationZone = locationZone;
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
}

