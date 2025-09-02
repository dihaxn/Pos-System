package com.lloms.userservice.repository;

import com.lloms.userservice.entity.UserSession;
import com.lloms.userservice.entity.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    
    Optional<UserSession> findByToken(String token);
    
    Optional<UserSession> findByRefreshToken(String refreshToken);
    
    List<UserSession> findByUserIdAndStatus(Long userId, SessionStatus status);
    
    List<UserSession> findByUserId(Long userId);
    
    @Query("SELECT s FROM UserSession s WHERE s.user.id = :userId AND s.status = 'ACTIVE'")
    List<UserSession> findActiveSessionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT s FROM UserSession s WHERE s.expiresAt < :now")
    List<UserSession> findExpiredSessions(@Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM UserSession s WHERE s.refreshExpiresAt < :now")
    List<UserSession> findExpiredRefreshTokens(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.status = :status WHERE s.id = :id")
    void updateSessionStatus(@Param("id") Long id, @Param("status") SessionStatus status);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.status = 'REVOKED' WHERE s.user.id = :userId")
    void revokeAllUserSessions(@Param("userId") Long userId);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.status = 'REVOKED' WHERE s.expiresAt < :now")
    void revokeExpiredSessions(@Param("now") LocalDateTime now);
    
    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.expiresAt < :cutoffDate")
    void deleteExpiredSessions(@Param("cutoffDate") LocalDateTime cutoffDate);
}
