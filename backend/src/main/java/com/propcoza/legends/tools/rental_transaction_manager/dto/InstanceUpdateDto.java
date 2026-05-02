package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class InstanceUpdateDto {

    @NotNull(message = "Instance ID is required for updates")
    private UUID id;

    private UUID rentalId;

    private LocalDate billingPeriod;

    private LocalDate actualPaymentDate;

    // -------------------------------
    //     Commission Percentages & Splits
    // -------------------------------

    @Min(value = 0, message = "Commission cannot be negative")
    @Max(value = 1, message = "Commission cannot exceed 100%")
    private Double rentalCommissionPercent;

    @Min(value = 0, message = "Office split cannot be negative")
    @Max(value = 1, message = "Office split cannot exceed 100%")
    private Double officeSplit;

    @Min(value = 0, message = "Agent split cannot be negative")
    @Max(value = 1, message = "Agent split cannot exceed 100%")
    private Double agentSplit;

    @Min(value = 0, message = "PAYE cannot be negative")
    @Max(value = 1, message = "PAYE cannot exceed 100%")
    private Double agentPaye;

    // -------------------------------
    //     Financial Snapshot
    // -------------------------------

    @PositiveOrZero(message = "Total amount paid cannot be negative")
    private BigDecimal totalAmountPaid;

    @Positive(message = "Base rent must be greater than zero")
    private BigDecimal baseRent;

    @PositiveOrZero(message = "Landlord payout cannot be negative")
    private BigDecimal landlordPayAmount;

    @PositiveOrZero(message = "Base commission cannot be negative")
    private BigDecimal baseComm;

    @PositiveOrZero(message = "VAT amount cannot be negative")
    private BigDecimal vat;

    @PositiveOrZero(message = "Commission excl. VAT cannot be negative")
    private BigDecimal commExclVat;

    @PositiveOrZero(message = "Company commission cannot be negative")
    private BigDecimal companyComm;

    @PositiveOrZero(message = "Agent gross commission cannot be negative")
    private BigDecimal agentGrossComm;

    @PositiveOrZero(message = "PAYE amount cannot be negative")
    private BigDecimal payeAmount;

    @PositiveOrZero(message = "Agent nett commission cannot be negative")
    private BigDecimal agentNettComm;

    // -------------------------------
    //     Optional Manual Entries
    // -------------------------------

    @PositiveOrZero(message = "Lease fee cannot be negative")
    private BigDecimal leaseFee;

    @PositiveOrZero(message = "Lease fee agent portion cannot be negative")
    private BigDecimal leaseFeeAgentPortion;

    @PositiveOrZero(message = "Lease fee office portion cannot be negative")
    private BigDecimal leaseFeeOfficePortion;

    @PositiveOrZero(message = "Deposit cannot be negative")
    private BigDecimal deposit;

    // -------------------------------
    //     Instance Specific Data
    // -------------------------------

    private InstanceStatus status;

    // -------------------------------
    //     Cross-Field Validation
    // -------------------------------

    @AssertTrue(message = "Agent split and office split must add up to 100% (1.0)")
    public boolean isSplitValid() {
        if (agentSplit == null || officeSplit == null) {
            return true;
        }
        return Math.abs((agentSplit + officeSplit) - 1.0) < 0.0001;
    }

    @AssertTrue(message = "Lease fee portions must sum to total lease fee")
    public boolean isLeaseFeeValid() {
        if (leaseFee == null || leaseFeeAgentPortion == null || leaseFeeOfficePortion == null) {
            return true;
        }
        return leaseFeeAgentPortion.add(leaseFeeOfficePortion).compareTo(leaseFee) == 0;
    }
}