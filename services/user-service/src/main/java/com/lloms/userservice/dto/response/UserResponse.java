package com.lloms.userservice.dto.response;

import com.lloms.userservice.entity.enums.UserRole;
import com.lloms.userservice.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private UserStatus status;
    private UserRole role;
    private Boolean isEmailVerified;
    private Boolean mfaEnabled;
    private String profileImageUrl;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
