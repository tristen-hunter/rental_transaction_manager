package com.propcoza.legends.tools.rental_transaction_manager.dto;

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
        @Size(min = 5, message = "Address must be greater than 5 characters")
        String address,

        @NotBlank(message = "Tenant name is required")
        @Size(min = 2, max = 100, message = "Tenant name must be between 2 and 100 characters")
        String tenantName,

        /**
         * paymentDate is mapped to startDate on creation.
         * startDate refers to the billingPeriod (so the month)
         */
        @NotNull(message = "Payment date is required")
        LocalDate paymentDate,

        // -------------------------------
        //    Recurring Rental Fields
        // -------------------------------

        @NotNull(message = "Auto-renew flag is required")
        Boolean autoRenew,

        // Optional: only validated if provided
        LocalDate endDate,

        // -------------------------------
        //    Landlord Info
        // -------------------------------

        @NotBlank(message = "Landlord name is required")
        @Size(min = 2, max = 100, message = "Landlord name must be between 2 and 100 characters")
        String landlordName,

        @NotBlank(message = "Landlord Bank Name is required")
        @Size(max = 100)
        @Pattern(
                regexp = "^(?i)(Absa|Capitec|FNB|First National Bank|Nedbank|Standard Bank|TymeBank|Discovery Bank|Investec|Other)$",
                message = "Please select a valid South African bank from the list"
        )
        String landlordBankName,

        @NotBlank(message = "Landlord Acc No is required")
        @Pattern(regexp = "^\\d{7,13}$", message = "Account number must be between 7 and 13 digits")
        String landlordAccNo,

        @NotBlank(message = "Landlord Bank Branch is required")
        @Pattern(regexp = "^\\d{6}$", message = "Branch code must be exactly 6 digits")
        String landlordBranch,

        // -------------------------------
        //    Commission Inputs
        // -------------------------------

        @NotNull(message = "Base rent is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Base rent must be greater than 0")
        BigDecimal baseRent,

        @NotNull(message = "Commission percentage is required")
        @DecimalMin(value = "0.01", message = "Commission percent must be at least 0.01 (1%)")
        @DecimalMax(value = "1.00", message = "Commission percent must be expressed as a decimal (e.g. 0.10 for 10%)")
        BigDecimal rentalCommissionPercent,

        @NotNull(message = "Office split is required")
        @DecimalMin(value = "0.01", message = "Office split must be at least 0.01 (1%)")
        @DecimalMax(value = "1.00", message = "Office split must be expressed as a decimal (e.g. 0.30 for 30%)")
        BigDecimal officeSplit,

        @NotNull(message = "Agent PAYE is required")
        @DecimalMin(value = "0.00", inclusive = true, message = "Agent PAYE cannot be negative")
        @DecimalMax(value = "1.00", message = "Agent PAYE must be expressed as a decimal (e.g. 0.25 for 25%)")
        BigDecimal agentPaye,

        // -------------------------------
        //    VAT
        // -------------------------------

        @NotNull(message = "VAT registered flag is required")
        Boolean vatRegistered

) {
        // -------------------------------
        //    Cross-Field Validation
        // -------------------------------

        @AssertTrue(message = "End date must be after the start/payment date")
        public boolean isEndDateValid() {
                if (endDate == null || paymentDate == null) {
                        return true; // Valid if not provided
                }
                return endDate.isAfter(paymentDate);
        }
}