package com.lloms.userservice.service;

import com.lloms.userservice.dto.request.*;
import com.lloms.userservice.dto.response.LoginResponse;
import com.lloms.userservice.dto.response.UserResponse;
import com.lloms.userservice.entity.User;
import com.lloms.userservice.entity.enums.UserRole;
import com.lloms.userservice.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    
    // Authentication & Registration
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    void logout(String token);
    LoginResponse refreshToken(String refreshToken);
    void verifyEmail(String token);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);
    
    // User Management
    UserResponse getUserById(Long id);
    UserResponse getUserByUsername(String username);
    UserResponse getUserByEmail(String email);
    Page<UserResponse> getAllUsers(Pageable pageable);
    Page<UserResponse> searchUsers(String username, String email, String firstName, String lastName, 
                                  UserStatus status, UserRole role, Pageable pageable);
    
    // User Updates
    UserResponse updateUser(Long id, UpdateUserRequest request);
    UserResponse updateUserStatus(Long id, UserStatus status);
    UserResponse updateUserRole(Long id, UserRole role);
    void changePassword(Long id, ChangePasswordRequest request);
    
    // Profile Management
    UserResponse getCurrentUser(String token);
    UserResponse updateCurrentUser(String token, UpdateUserRequest request);
    
    // MFA
    String generateMfaSecret(Long userId);
    void enableMfa(Long userId, String mfaCode);
    void disableMfa(Long userId, String password);
    boolean verifyMfaCode(Long userId, String mfaCode);
    
    // Session Management
    List<UserResponse> getActiveSessions(Long userId);
    void revokeSession(Long userId, Long sessionId);
    void revokeAllSessions(Long userId);
    
    // Admin Operations
    void deleteUser(Long id);
    void unlockUser(Long id);
    List<UserResponse> getLockedUsers();
    List<UserResponse> getInactiveUsers(int days);
    
    // Statistics
    long getUserCount();
    long getUserCountByStatus(UserStatus status);
    long getUserCountByRole(UserRole role);
    
    // Internal methods
    User findUserById(Long id);
    User findUserByUsername(String username);
    User findUserByEmail(String email);
    boolean isUsernameAvailable(String username);
    boolean isEmailAvailable(String email);
}
