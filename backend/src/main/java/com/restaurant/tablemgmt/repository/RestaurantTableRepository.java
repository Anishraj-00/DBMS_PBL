package com.restaurant.tablemgmt.repository;

import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.entity.enums.TableZone;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    List<RestaurantTable> findByIsActiveTrueOrderByTableNumberAsc();

    List<RestaurantTable> findByStatusAndIsActiveTrue(TableStatus status);

    List<RestaurantTable> findByLocationZoneAndIsActiveTrue(TableZone zone);

    Optional<RestaurantTable> findByTableNumber(String tableNumber);

    boolean existsByTableNumber(String tableNumber);

    /**
     * DBMS Concurrency Guard:
     * Acquires a pessimistic write lock (SELECT ... FOR UPDATE in MySQL)
     * to prevent race conditions during table allocation.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM RestaurantTable t WHERE t.id = :id")
    Optional<RestaurantTable> findByIdWithLock(@Param("id") Long id);

    /**
     * Best-Fit Allocation Query:
     * Finds active tables with AVAILABLE status that can accommodate the party size,
     * sorted by capacity ascending (to pick the smallest suitable table) and table number.
     */
    @Query("SELECT t FROM RestaurantTable t " +
           "WHERE t.isActive = true " +
           "AND t.status = com.restaurant.tablemgmt.entity.enums.TableStatus.AVAILABLE " +
           "AND t.capacity >= :partySize " +
           "ORDER BY t.capacity ASC, t.tableNumber ASC")
    List<RestaurantTable> findAvailableTablesForPartySize(@Param("partySize") Integer partySize);
}

