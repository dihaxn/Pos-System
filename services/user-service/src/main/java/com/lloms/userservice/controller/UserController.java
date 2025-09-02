package com.lloms.userservice.controller;

import com.lloms.userservice.dto.request.*;
import com.lloms.userservice.dto.response.LoginResponse;
import com.lloms.userservice.dto.response.UserResponse;
import com.lloms.userservice.entity.enums.UserRole;
import com.lloms.userservice.entity.enums.UserStatus;
import com.lloms.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user management, authentication, and authorization")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user account")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request received for username: {}", request.getUsername());
        UserResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT tokens")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for: {}", request.getUsernameOrEmail());
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user and invalidate session")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7); // Remove "Bearer " prefix
        userService.logout(jwtToken);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh JWT token", description = "Generate new access token using refresh token")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody String refreshToken) {
        LoginResponse response = userService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Verify user email with token")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request-password-reset")
    @Operation(summary = "Request password reset", description = "Request password reset email")
    public ResponseEntity<Void> requestPasswordReset(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password with token")
    public ResponseEntity<Void> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user details")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7); // Remove "Bearer " prefix
        UserResponse response = userService.getCurrentUser(jwtToken);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user", description = "Update current user profile")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody UpdateUserRequest request) {
        String jwtToken = token.substring(7); // Remove "Bearer " prefix
        UserResponse response = userService.updateCurrentUser(jwtToken, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/change-password")
    @Operation(summary = "Change password", description = "Change current user password")
    public ResponseEntity<Void> changePassword(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ChangePasswordRequest request) {
        String jwtToken = token.substring(7); // Remove "Bearer " prefix
        Long userId = userService.getCurrentUser(jwtToken).getId();
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all users", description = "Get paginated list of all users (Admin only)")
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        Page<UserResponse> response = userService.getAllUsers(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Search users", description = "Search users with filters (Admin only)")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @Parameter(description = "Username filter") @RequestParam(required = false) String username,
            @Parameter(description = "Email filter") @RequestParam(required = false) String email,
            @Parameter(description = "First name filter") @RequestParam(required = false) String firstName,
            @Parameter(description = "Last name filter") @RequestParam(required = false) String lastName,
            @Parameter(description = "Status filter") @RequestParam(required = false) UserStatus status,
            @Parameter(description = "Role filter") @RequestParam(required = false) UserRole role,
            Pageable pageable) {
        Page<UserResponse> response = userService.searchUsers(username, email, firstName, lastName, status, role,
                pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Get user by ID", description = "Get user details by ID")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user", description = "Update user details (Admin only)")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user status", description = "Update user status (Admin only)")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        UserResponse response = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user role", description = "Update user role (Super Admin only)")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @RequestParam UserRole role) {
        UserResponse response = userService.updateUserRole(id, role);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete user", description = "Delete user (Super Admin only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/unlock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Unlock user", description = "Unlock locked user account (Admin only)")
    public ResponseEntity<Void> unlockUser(@PathVariable Long id) {
        userService.unlockUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/locked")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get locked users", description = "Get list of locked users (Admin only)")
    public ResponseEntity<List<UserResponse>> getLockedUsers() {
        List<UserResponse> response = userService.getLockedUsers();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/inactive")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get inactive users", description = "Get list of inactive users (Admin only)")
    public ResponseEntity<List<UserResponse>> getInactiveUsers(
            @RequestParam(defaultValue = "30") int days) {
        List<UserResponse> response = userService.getInactiveUsers(days);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get user statistics", description = "Get user statistics (Admin only)")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        UserStatsResponse response = UserStatsResponse.builder()
                .totalUsers(userService.getUserCount())
                .activeUsers(userService.getUserCountByStatus(UserStatus.ACTIVE))
                .inactiveUsers(userService.getUserCountByStatus(UserStatus.INACTIVE))
                .pendingUsers(userService.getUserCountByStatus(UserStatus.PENDING_VERIFICATION))
                .adminUsers(userService.getUserCountByRole(UserRole.ADMIN))
                .cashierUsers(userService.getUserCountByRole(UserRole.CASHIER))
                .customerUsers(userService.getUserCountByRole(UserRole.CUSTOMER))
                .build();
        return ResponseEntity.ok(response);
    }

    // MFA endpoints
    @PostMapping("/{id}/mfa/generate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Generate MFA secret", description = "Generate MFA secret for user")
    public ResponseEntity<String> generateMfaSecret(@PathVariable Long id) {
        String secret = userService.generateMfaSecret(id);
        return ResponseEntity.ok(secret);
    }

    @PostMapping("/{id}/mfa/enable")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Enable MFA", description = "Enable MFA for user")
    public ResponseEntity<Void> enableMfa(@PathVariable Long id, @RequestParam String mfaCode) {
        userService.enableMfa(id, mfaCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mfa/disable")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Disable MFA", description = "Disable MFA for user")
    public ResponseEntity<Void> disableMfa(@PathVariable Long id, @RequestParam String password) {
        userService.disableMfa(id, password);
        return ResponseEntity.ok().build();
    }

    // Session management endpoints
    @GetMapping("/{id}/sessions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Get user sessions", description = "Get active sessions for user")
    public ResponseEntity<List<UserResponse>> getActiveSessions(@PathVariable Long id) {
        List<UserResponse> response = userService.getActiveSessions(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/sessions/{sessionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Revoke session", description = "Revoke specific user session")
    public ResponseEntity<Void> revokeSession(@PathVariable Long id, @PathVariable Long sessionId) {
        userService.revokeSession(id, sessionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/sessions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN') or @userService.findUserById(#id).username == authentication.name")
    @Operation(summary = "Revoke all sessions", description = "Revoke all user sessions")
    public ResponseEntity<Void> revokeAllSessions(@PathVariable Long id) {
        userService.revokeAllSessions(id);
        return ResponseEntity.ok().build();
    }

    // Helper class for statistics response
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UserStatsResponse {
        private long totalUsers;
        private long activeUsers;
        private long inactiveUsers;
        private long pendingUsers;
        private long adminUsers;
        private long cashierUsers;
        private long customerUsers;
    }
}
