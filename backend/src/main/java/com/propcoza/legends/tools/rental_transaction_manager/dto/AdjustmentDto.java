package com.propcoza.legends.tools.rental_transaction_manager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class AdjustmentDto {

    @NotNull(message = "Rental Instance ID is required")
    private UUID rentalInstanceId;

    @NotBlank(message = "Adjustment type is required")
    private String type; // e.g., "VAT", "REPAIR", "ADMIN_FEE"

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "Description for adjustment is required")
    private String description;
}