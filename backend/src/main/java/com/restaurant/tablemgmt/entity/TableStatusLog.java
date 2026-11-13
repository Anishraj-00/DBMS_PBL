package com.restaurant.tablemgmt.entity;

import com.restaurant.tablemgmt.entity.enums.TableStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_status_logs")
public class TableStatusLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", nullable = false)
    private TableStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private TableStatus newStatus;

    @Column(length = 255)
    private String reason;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    public TableStatusLog() {}

    public TableStatusLog(RestaurantTable table, TableStatus previousStatus, TableStatus newStatus, String reason) {
        this.table = table;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.reason = reason;
        this.changedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RestaurantTable getTable() {
        return table;
    }

    public void setTable(RestaurantTable table) {
        this.table = table;
    }

    public TableStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(TableStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public TableStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(TableStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}

