package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class RentalUpdateDto {

    // -------------------------------
    //    Relationship
    // -------------------------------

    @NotNull(message = "Agent ID is required")
    private UUID agentId;

    // -------------------------------
    //    Meta Data
    // -------------------------------

    @NotBlank(message = "Address is required")
    @Size(min = 5, message = "Address must be greater than 5 characters")
    private String address;

    @NotBlank(message = "Tenant name is required")
    @Size(min = 2, max = 100, message = "Tenant name must be between 2 and 100 characters")
    private String tenantName;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    // -------------------------------
    //    Recurring Rental Fields
    // -------------------------------

    private LocalDate endDate;

    @NotNull(message = "Auto-renew flag is required")
    private Boolean autoRenew;

    @NotNull(message = "Rental status is required")
    private RentalStatus status; // No default value! Removed @Enumerated

    // -------------------------------
    //     Landlord Info
    // -------------------------------

    @NotBlank(message = "Landlord name is required")
    @Size(min = 2, max = 100, message = "Landlord name must be between 2 and 100 characters")
    private String landlordName;

    @NotBlank(message = "Landlord Bank Name is required")
    @Size(max = 100)
    @Pattern(
            regexp = "^(?i)(Absa|Capitec|FNB|First National Bank|Nedbank|Standard Bank|TymeBank|Discovery Bank|Investec|Other)$",
            message = "Please select a valid South African bank from the list"
    )
    private String landlordBankName;

    @NotBlank(message = "Landlord Acc No is required")
    @Pattern(regexp = "^\\d{7,13}$", message = "Account number must be between 7 and 13 digits")
    private String landlordAccNo;

    @NotBlank(message = "Landlord Bank Branch is required")
    @Pattern(regexp = "^\\d{6}$", message = "Branch code must be exactly 6 digits")
    private String landlordBranch;

    // -------------------------------
    //     Commission Data
    // -------------------------------

    @NotNull(message = "Base rent is required")
    @DecimalMin(value = "0.01", message = "Base rent must be greater than 0")
    private BigDecimal baseRent;

    @NotNull(message = "Commission percentage is required")
    @DecimalMin(value = "0.01", message = "Commission percent must be at least 0.01 (1%)")
    @DecimalMax(value = "1.00", message = "Commission percent must be expressed as a decimal (e.g. 0.10 for 10%)")
    private BigDecimal rentalCommissionPercent;

    @NotNull(message = "Office split is required")
    @DecimalMin(value = "0.01", message = "Office split must be at least 0.01 (1%)")
    @DecimalMax(value = "1.00", message = "Office split must be expressed as a decimal (e.g. 0.30 for 30%)")
    private BigDecimal officeSplit;

    @NotNull(message = "Office split is required")
    @DecimalMin(value = "0.01", message = "Agent split must be at least 0.01 (1%)")
    @DecimalMax(value = "1.00", message = "Agent split must be expressed as a decimal (e.g. 0.30 for 30%)")
    private BigDecimal agentSplit;

    @NotNull(message = "Agent PAYE is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Agent PAYE cannot be negative")
    @DecimalMax(value = "1.00", message = "Agent PAYE must be expressed as a decimal (e.g. 0.25 for 25%)")
    private BigDecimal agentPaye;

    @NotNull(message = "VAT registered flag is required")
    private Boolean vatRegistered;

    // -------------------------------
    //    Cross-Field Validation
    // -------------------------------

    @AssertTrue(message = "End date must be after the start/payment date")
    public boolean isEndDateValid() {
        if (endDate == null || paymentDate == null) {
            return true;
        }
        return endDate.isAfter(paymentDate);
    }
}