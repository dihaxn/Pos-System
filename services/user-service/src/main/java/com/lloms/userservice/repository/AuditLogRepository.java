package com.lloms.userservice.repository;

import com.lloms.userservice.entity.AuditLog;
import com.lloms.userservice.entity.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByAction(AuditAction action);

    List<AuditLog> findByUserIdAndAction(Long userId, AuditAction action);

    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByTimestampBetween(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM AuditLog a WHERE a.user.id = :userId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByUserIdAndTimestampBetween(@Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM AuditLog a WHERE " +
            "(:userId IS NULL OR a.user.id = :userId) AND " +
            "(:action IS NULL OR a.action = :action) AND " +
            "(:resourceType IS NULL OR a.resourceType = :resourceType) AND " +
            "(:success IS NULL OR a.success = :success) AND " +
            "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
            "(:endDate IS NULL OR a.timestamp <= :endDate)")
    Page<AuditLog> findAuditLogsWithFilters(
            @Param("userId") Long userId,
            @Param("action") AuditAction action,
            @Param("resourceType") String resourceType,
            @Param("success") Boolean success,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.user.id = :userId AND a.action = :action")
    long countByUserIdAndAction(@Param("userId") Long userId, @Param("action") AuditAction action);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.action = :action AND a.timestamp BETWEEN :startDate AND :endDate")
    long countByActionAndTimestampBetween(@Param("action") AuditAction action,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
