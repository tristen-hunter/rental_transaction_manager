package com.propcoza.legends.tools.rental_transaction_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentReturnDto {
    private UUID id;

    private String fullName;

    private String bankName;

    private String accountNumber;

    private String branchCode;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Returns the count of rentals rather than the full list for performance
    private Integer totalRentals;
}
