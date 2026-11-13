package com.restaurant.tablemgmt.repository;

import com.restaurant.tablemgmt.entity.TableStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableStatusLogRepository extends JpaRepository<TableStatusLog, Long> {
    List<TableStatusLog> findByTableIdOrderByChangedAtDesc(Long tableId);
    List<TableStatusLog> findTop50ByOrderByChangedAtDesc();
}

