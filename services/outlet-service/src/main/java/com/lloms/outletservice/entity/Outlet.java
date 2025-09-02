package com.lloms.outletservice.entity;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "outlets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Outlet {

    @Id
    private String id;

    @NotBlank(message = "Outlet name is required")
    @Size(max = 100, message = "Outlet name must not exceed 100 characters")
    @Indexed(unique = true)
    private String name;

    @NotBlank(message = "Outlet code is required")
    @Size(max = 20, message = "Outlet code must not exceed 20 characters")
    @Indexed(unique = true)
    private String code;

    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number should be valid")
    private String phoneNumber;

    @Email(message = "Email should be valid")
    private String email;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OutletStatus status = OutletStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OutletType type = OutletType.RETAIL;

    @DecimalMin(value = "0.0", message = "Latitude must be non-negative")
    @DecimalMax(value = "90.0", message = "Latitude must be less than or equal to 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be greater than or equal to -180")
    @DecimalMax(value = "180.0", message = "Longitude must be less than or equal to 180")
    private Double longitude;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Field("opening_hours")
    private OpeningHours openingHours;

    @Field("manager_id")
    private String managerId;

    @Field("cashier_ids")
    private List<String> cashierIds;

    @Field("pos_terminals")
    private List<PosTerminal> posTerminals;

    @Field("inventory_settings")
    private InventorySettings inventorySettings;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Field("created_by")
    private String createdBy;

    @Field("updated_by")
    private String updatedBy;

    @Version
    private Long version;

    // Helper methods
    public boolean isActive() {
        return status == OutletStatus.ACTIVE;
    }

    public void addCashier(String cashierId) {
        if (cashierIds == null) {
            cashierIds = new ArrayList<>();
        }
        if (!cashierIds.contains(cashierId)) {
            cashierIds.add(cashierId);
        }
    }

    public void removeCashier(String cashierId) {
        if (cashierIds != null) {
            cashierIds.remove(cashierId);
        }
    }

    public void addPosTerminal(PosTerminal terminal) {
        if (posTerminals == null) {
            posTerminals = new ArrayList<>();
        }
        posTerminals.add(terminal);
    }
}
