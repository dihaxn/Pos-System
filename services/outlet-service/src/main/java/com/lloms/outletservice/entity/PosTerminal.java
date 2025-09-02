package com.lloms.outletservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PosTerminal {

    private String id;
    private String name;
    private String location;
    private String status; // ACTIVE, INACTIVE, MAINTENANCE
    private String assignedCashierId;
    private LocalDateTime lastUsed;
    private String ipAddress;
    private String macAddress;
    private String softwareVersion;
    private LocalDateTime lastSync;
}
