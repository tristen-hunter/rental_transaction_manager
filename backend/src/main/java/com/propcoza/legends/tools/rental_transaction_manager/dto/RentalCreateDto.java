package com.propcoza.legends.tools.rental_transaction_manager.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO used when creating a new Rental (master template).
 * Financial outputs (comm, VAT, etc.) are NOT included here —
 * they are calculated by the service layer from these inputs.
 */
public record RentalCreateDto(

        // -------------------------------
        //    Relationship
        // -------------------------------

        @NotNull(message = "Agent ID is required")
        UUID agentId,

        // -------------------------------
        //    Meta Data
        // -------------------------------

        @NotBlank(message = "Address is required")
        @Size(max = 100)
        String address,

        @NotBlank(message = "Tenant name is required")
        @Size(max = 100)
        String tenantName,

        @NotNull(message = "Payment date is required")
        LocalDate paymentDate,

        // -------------------------------
        //    Recurring Rental Fields
        // -------------------------------

        @NotNull(message = "Auto-renew flag is required")
        Boolean autoRenew,

        // endDate is optional — only set if this is a fixed-term rental
        LocalDate endDate,

        // -------------------------------
        //    Landlord Info
        // -------------------------------

        @NotBlank(message = "Landlord name is required")
        @Size(max = 100)
        String landlordName,
        @NotBlank(message = "Landlord Bank Name is required")
        @Size(max = 100)
        String landlordBankName,
        @NotBlank(message = "Landlord Acc No is required")
        @Size(max = 12)
        String landlordAccNo,
        @NotBlank(message = "Landlord Bank Branch is required (use a universal one if you don't have it)")
        @Size(max = 6)
        String landlordBranch,

        // -------------------------------
        //    Commission Inputs
        // -------------------------------

        /// the rent amount paid every month (used to calculate payouts)
        @NotNull(message = "Base rent is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
        BigDecimal baseRent, // used to calculate comm and landlord portion

        @DecimalMin(value = "0.0", inclusive = false, message = "Commission percent must be greater than 0")
        @DecimalMax(value = "1.0", message = "Commission percent must be expressed as a decimal (e.g. 0.10 for 10%)")
        @NotNull
        Double rentalCommissionPercent,

        @DecimalMin(value = "0.0", inclusive = false, message = "Office split must be greater than 0")
        @DecimalMax(value = "1.0", message = "Office split must be expressed as a decimal (e.g. 0.30 for 30%)")
        @NotNull
        Double officeSplit,

        /**
         * Agent split is intentionally excluded here.
         * It is derived as (1 - officeSplit) in the service layer
         * to avoid inconsistency bugs.
         */
        @DecimalMin(value = "0.0", inclusive = false, message = "Agent PAYE must be greater than 0")
        @DecimalMax(value = "1.0", message = "Agent PAYE must be expressed as a decimal (e.g. 0.25 for 25%)")
        @NotNull
        Double agentPaye,

        // -------------------------------
        //    VAT
        // -------------------------------

        @NotNull(message = "VAT registered flag is required")
        Boolean vatRegistered,

        // -------------------------------
        //    Audit
        // -------------------------------

        @Size(max = 100)
        @NotBlank(message = "Created by is required")
        String createdBy

) {}