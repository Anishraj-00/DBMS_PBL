package com.restaurant.tablemgmt.repository;

import com.restaurant.tablemgmt.entity.OccupancySession;
import com.restaurant.tablemgmt.entity.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OccupancySessionRepository extends JpaRepository<OccupancySession, Long> {

    Optional<OccupancySession> findByTableIdAndStatus(Long tableId, SessionStatus status);

    List<OccupancySession> findByStatusOrderByCheckInTimeDesc(SessionStatus status);

    List<OccupancySession> findByTableIdOrderByCheckInTimeDesc(Long tableId);

    @Query("SELECT s FROM OccupancySession s WHERE s.status = 'COMPLETED'")
    List<OccupancySession> findAllCompletedSessions();

    @Query("SELECT COALESCE(SUM(s.partySize), 0) FROM OccupancySession s WHERE s.status = 'ACTIVE'")
    Long countActiveDiners();

    @Query("SELECT AVG(s.diningDurationMinutes) FROM OccupancySession s WHERE s.status = 'COMPLETED' AND s.diningDurationMinutes IS NOT NULL")
    Double calculateAverageDiningMinutes();

    @Query("SELECT COUNT(s) FROM OccupancySession s WHERE s.table.id = :tableId AND s.status = 'COMPLETED'")
    long countCompletedSessionsByTableId(@Param("tableId") Long tableId);

    @Query("SELECT COALESCE(SUM(s.diningDurationMinutes), 0) FROM OccupancySession s WHERE s.table.id = :tableId AND s.status = 'COMPLETED'")
    long sumDiningMinutesByTableId(@Param("tableId") Long tableId);
}

