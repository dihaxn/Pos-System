package com.lloms.userservice.service.impl;

import com.lloms.userservice.dto.request.*;
import com.lloms.userservice.dto.response.LoginResponse;
import com.lloms.userservice.dto.response.UserResponse;
import com.lloms.userservice.entity.AuditLog;
import com.lloms.userservice.entity.User;
import com.lloms.userservice.entity.UserSession;
import com.lloms.userservice.entity.enums.AuditAction;
import com.lloms.userservice.entity.enums.SessionStatus;
import com.lloms.userservice.entity.enums.UserRole;
import com.lloms.userservice.entity.enums.UserStatus;
import com.lloms.userservice.exception.*;
import com.lloms.userservice.mapper.UserMapper;
import com.lloms.userservice.repository.AuditLogRepository;
import com.lloms.userservice.repository.UserRepository;
import com.lloms.userservice.repository.UserSessionRepository;
import com.lloms.userservice.service.JwtService;
import com.lloms.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    
    @Override
    public UserResponse register(RegisterRequest request) {
        log.info("Registering new user with username: {}", request.getUsername());
        
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new PasswordMismatchException("Passwords do not match");
        }
        
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUserException("Username already exists: " + request.getUsername());
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("Email already exists: " + request.getEmail());
        }
        
        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .status(UserStatus.PENDING_VERIFICATION)
                .role(UserRole.CUSTOMER)
                .emailVerificationToken(UUID.randomUUID().toString())
                .build();
        
        User savedUser = userRepository.save(user);
        
        // Log audit
        logAudit(savedUser, AuditAction.CREATE, "User registered", null, null);
        
        log.info("User registered successfully with ID: {}", savedUser.getId());
        return userMapper.toResponse(savedUser);
    }
    
    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for: {}", request.getUsernameOrEmail());
        
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new UserNotFoundException("Invalid username or email"));
        
        // Check if account is locked
        if (user.isAccountLocked()) {
            logAudit(user, AuditAction.FAILED_LOGIN, "Login attempt on locked account", null, null);
            throw new AccountLockedException("Account is locked. Please try again later.");
        }
        
        // Check if account is active
        if (user.getStatus() != UserStatus.ACTIVE && user.getStatus() != UserStatus.PENDING_VERIFICATION) {
            logAudit(user, AuditAction.FAILED_LOGIN, "Login attempt on inactive account", null, null);
            throw new AccountInactiveException("Account is not active");
        }
        
        // Verify password
        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            user.incrementFailedLoginAttempts();
            userRepository.save(user);
            logAudit(user, AuditAction.FAILED_LOGIN, "Invalid password", null, null);
            throw new InvalidCredentialsException("Invalid password");
        }
        
        // Check MFA if enabled
        if (user.getMfaEnabled() && request.getMfaCode() == null) {
            logAudit(user, AuditAction.LOGIN, "MFA required", null, null);
            return LoginResponse.builder()
                    .mfaRequired(true)
                    .user(userMapper.toResponse(user))
                    .build();
        }
        
        if (user.getMfaEnabled() && !verifyMfaCode(user.getId(), request.getMfaCode())) {
            logAudit(user, AuditAction.FAILED_LOGIN, "Invalid MFA code", null, null);
            throw new InvalidMfaCodeException("Invalid MFA code");
        }
        
        // Reset failed login attempts
        user.resetFailedLoginAttempts();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Create session
        UserSession session = UserSession.builder()
                .user(user)
                .token(accessToken)
                .refreshToken(refreshToken)
                .expiresAt(LocalDateTime.now().plusSeconds(jwtService.getJwtExpiration() / 1000))
                .refreshExpiresAt(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpiration() / 1000))
                .build();
        
        userSessionRepository.save(session);
        
        logAudit(user, AuditAction.LOGIN, "Successful login", null, null);
        
        log.info("User logged in successfully: {}", user.getUsername());
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getJwtExpiration() / 1000)
                .user(userMapper.toResponse(user))
                .mfaRequired(false)
                .build();
    }
    
    @Override
    public void logout(String token) {
        log.info("Logout request for token");
        
        UserSession session = userSessionRepository.findByToken(token)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));
        
        User user = session.getUser();
        session.setStatus(SessionStatus.REVOKED);
        userSessionRepository.save(session);
        
        logAudit(user, AuditAction.LOGOUT, "User logged out", null, null);
        log.info("User logged out successfully: {}", user.getUsername());
    }
    
    @Override
    public LoginResponse refreshToken(String refreshToken) {
        log.info("Token refresh request");
        
        UserSession session = userSessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new SessionNotFoundException("Invalid refresh token"));
        
        if (session.isRefreshExpired()) {
            throw new SessionExpiredException("Refresh token has expired");
        }
        
        User user = session.getUser();
        
        // Generate new tokens
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        // Update session
        session.setToken(newAccessToken);
        session.setRefreshToken(newRefreshToken);
        session.setExpiresAt(LocalDateTime.now().plusSeconds(jwtService.getJwtExpiration() / 1000));
        session.setRefreshExpiresAt(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpiration() / 1000));
        userSessionRepository.save(session);
        
        log.info("Token refreshed successfully for user: {}", user.getUsername());
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getJwtExpiration() / 1000)
                .user(userMapper.toResponse(user))
                .mfaRequired(false)
                .build();
    }
    
    @Override
    public void verifyEmail(String token) {
        log.info("Email verification request");
        
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid verification token"));
        
        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        
        logAudit(user, AuditAction.EMAIL_VERIFICATION, "Email verified", null, null);
        log.info("Email verified successfully for user: {}", user.getUsername());
    }
    
    @Override
    public void requestPasswordReset(String email) {
        log.info("Password reset request for email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        
        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpires(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        
        // TODO: Send email with reset token
        logAudit(user, AuditAction.PASSWORD_RESET_REQUEST, "Password reset requested", null, null);
        log.info("Password reset token generated for user: {}", user.getUsername());
    }
    
    @Override
    public void resetPassword(String token, String newPassword) {
        log.info("Password reset with token");
        
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid reset token"));
        
        if (user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Reset token has expired");
        }
        
        user.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);
        userRepository.save(user);
        
        // Revoke all sessions
        revokeAllSessions(user.getId());
        
        logAudit(user, AuditAction.PASSWORD_RESET_COMPLETE, "Password reset completed", null, null);
        log.info("Password reset completed for user: {}", user.getUsername());
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = findUserById(id);
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = findUserByUsername(username);
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = findUserByEmail(email);
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(String username, String email, String firstName, String lastName,
                                          UserStatus status, UserRole role, Pageable pageable) {
        return userRepository.findUsersWithFilters(username, email, firstName, lastName, status, role, pageable)
                .map(userMapper::toResponse);
    }
    
    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", id);
        
        User user = findUserById(id);
        
        // Store old values for audit
        String oldValues = String.format("firstName=%s,lastName=%s,phoneNumber=%s,profileImageUrl=%s",
                user.getFirstName(), user.getLastName(), user.getPhoneNumber(), user.getProfileImageUrl());
        
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }
        
        User savedUser = userRepository.save(user);
        
        String newValues = String.format("firstName=%s,lastName=%s,phoneNumber=%s,profileImageUrl=%s",
                savedUser.getFirstName(), savedUser.getLastName(), savedUser.getPhoneNumber(), savedUser.getProfileImageUrl());
        
        logAudit(savedUser, AuditAction.UPDATE, "User profile updated", oldValues, newValues);
        
        log.info("User updated successfully: {}", savedUser.getUsername());
        return userMapper.toResponse(savedUser);
    }
    
    @Override
    public UserResponse updateUserStatus(Long id, UserStatus status) {
        log.info("Updating user status for ID: {} to {}", id, status);
        
        User user = findUserById(id);
        UserStatus oldStatus = user.getStatus();
        user.setStatus(status);
        User savedUser = userRepository.save(user);
        
        logAudit(savedUser, AuditAction.STATUS_CHANGE, "User status changed", oldStatus.name(), status.name());
        
        log.info("User status updated successfully: {}", savedUser.getUsername());
        return userMapper.toResponse(savedUser);
    }
    
    @Override
    public UserResponse updateUserRole(Long id, UserRole role) {
        log.info("Updating user role for ID: {} to {}", id, role);
        
        User user = findUserById(id);
        UserRole oldRole = user.getRole();
        user.setRole(role);
        User savedUser = userRepository.save(user);
        
        logAudit(savedUser, AuditAction.ROLE_CHANGE, "User role changed", oldRole.name(), role.name());
        
        log.info("User role updated successfully: {}", savedUser.getUsername());
        return userMapper.toResponse(savedUser);
    }
    
    @Override
    public void changePassword(Long id, ChangePasswordRequest request) {
        log.info("Changing password for user ID: {}", id);
        
        User user = findUserById(id);
        
        // Verify current password
        if (!BCrypt.checkpw(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }
        
        // Validate new passwords match
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new PasswordMismatchException("New passwords do not match");
        }
        
        user.setPassword(BCrypt.hashpw(request.getNewPassword(), BCrypt.gensalt()));
        userRepository.save(user);
        
        // Revoke all sessions except current
        revokeAllSessions(id);
        
        logAudit(user, AuditAction.PASSWORD_CHANGE, "Password changed", null, null);
        log.info("Password changed successfully for user: {}", user.getUsername());
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String token) {
        String username = jwtService.extractUsername(token);
        User user = findUserByUsername(username);
        return userMapper.toResponse(user);
    }
    
    @Override
    public UserResponse updateCurrentUser(String token, UpdateUserRequest request) {
        String username = jwtService.extractUsername(token);
        User user = findUserByUsername(username);
        return updateUser(user.getId(), request);
    }
    
    @Override
    public String generateMfaSecret(Long userId) {
        log.info("Generating MFA secret for user ID: {}", userId);
        
        User user = findUserById(userId);
        String secret = UUID.randomUUID().toString();
        user.setMfaSecret(secret);
        userRepository.save(user);
        
        logAudit(user, AuditAction.MFA_ENABLE, "MFA secret generated", null, null);
        return secret;
    }
    
    @Override
    public void enableMfa(Long userId, String mfaCode) {
        log.info("Enabling MFA for user ID: {}", userId);
        
        User user = findUserById(userId);
        
        if (!verifyMfaCode(userId, mfaCode)) {
            throw new InvalidMfaCodeException("Invalid MFA code");
        }
        
        user.setMfaEnabled(true);
        userRepository.save(user);
        
        logAudit(user, AuditAction.MFA_ENABLE, "MFA enabled", null, null);
        log.info("MFA enabled successfully for user: {}", user.getUsername());
    }
    
    @Override
    public void disableMfa(Long userId, String password) {
        log.info("Disabling MFA for user ID: {}", userId);
        
        User user = findUserById(userId);
        
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new InvalidCredentialsException("Password is incorrect");
        }
        
        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);
        
        logAudit(user, AuditAction.MFA_DISABLE, "MFA disabled", null, null);
        log.info("MFA disabled successfully for user: {}", user.getUsername());
    }
    
    @Override
    public boolean verifyMfaCode(Long userId, String mfaCode) {
        // TODO: Implement proper MFA verification (TOTP)
        // For now, return true for demo purposes
        return mfaCode != null && mfaCode.length() == 6;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getActiveSessions(Long userId) {
        List<UserSession> sessions = userSessionRepository.findActiveSessionsByUserId(userId);
        return sessions.stream()
                .map(session -> userMapper.toResponse(session.getUser()))
                .collect(Collectors.toList());
    }
    
    @Override
    public void revokeSession(Long userId, Long sessionId) {
        log.info("Revoking session {} for user ID: {}", sessionId, userId);
        
        UserSession session = userSessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));
        
        if (!session.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Cannot revoke session for another user");
        }
        
        session.setStatus(SessionStatus.REVOKED);
        userSessionRepository.save(session);
        
        logAudit(session.getUser(), AuditAction.SESSION_REVOKE, "Session revoked", null, null);
        log.info("Session revoked successfully");
    }
    
    @Override
    public void revokeAllSessions(Long userId) {
        log.info("Revoking all sessions for user ID: {}", userId);
        
        userSessionRepository.revokeAllUserSessions(userId);
        
        User user = findUserById(userId);
        logAudit(user, AuditAction.SESSION_REVOKE, "All sessions revoked", null, null);
        
        log.info("All sessions revoked successfully for user: {}", user.getUsername());
    }
    
    @Override
    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);
        
        User user = findUserById(id);
        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
        
        // Revoke all sessions
        revokeAllSessions(id);
        
        logAudit(user, AuditAction.DELETE, "User deleted", null, null);
        log.info("User deleted successfully: {}", user.getUsername());
    }
    
    @Override
    public void unlockUser(Long id) {
        log.info("Unlocking user with ID: {}", id);
        
        User user = findUserById(id);
        user.resetFailedLoginAttempts();
        userRepository.save(user);
        
        logAudit(user, AuditAction.ACCOUNT_UNLOCK, "Account unlocked", null, null);
        log.info("User unlocked successfully: {}", user.getUsername());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getLockedUsers() {
        List<User> lockedUsers = userRepository.findLockedAccounts(LocalDateTime.now());
        return lockedUsers.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getInactiveUsers(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        List<User> inactiveUsers = userRepository.findInactiveUsers(cutoffDate);
        return inactiveUsers.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getUserCount() {
        return userRepository.count();
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getUserCountByStatus(UserStatus status) {
        return userRepository.countByStatus(status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getUserCountByRole(UserRole role) {
        return userRepository.countByRole(role);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
    
    private void logAudit(User user, AuditAction action, String description, String oldValues, String newValues) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(description)
                .actionType(action)
                .resourceType("User")
                .resourceId(user.getId().toString())
                .oldValues(oldValues)
                .newValues(newValues)
                .build();
        
        auditLogRepository.save(auditLog);
    }
}
