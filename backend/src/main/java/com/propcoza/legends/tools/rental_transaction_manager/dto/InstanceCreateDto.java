package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class InstanceCreateDto {

    @NotNull(message = "Rental ID is required")
    private UUID rentalId;

    @NotNull(message = "Billing period is required")
    private LocalDate billingPeriod;

    private LocalDate actualPaymentDate;

    @NotNull(message = "Instance status is required")
    private InstanceStatus status = InstanceStatus.DRAFT;

    // -------------------------------
    //     Commission Percentages & Splits
    // -------------------------------

    @NotNull(message = "Rental commission percentage is required")
    @Min(value = 0, message = "Commission cannot be negative")
    @Max(value = 1, message = "Commission cannot exceed 100%")
    private BigDecimal rentalCommissionPercent;

    @NotNull(message = "Office split is required")
    @Min(value = 0, message = "Office split cannot be negative")
    @Max(value = 1, message = "Office split cannot exceed 100%")
    private BigDecimal officeSplit;

    @NotNull(message = "Agent split is required")
    @Min(value = 0, message = "Agent split cannot be negative")
    @Max(value = 1, message = "Agent split cannot exceed 100%")
    private BigDecimal agentSplit;

    @NotNull(message = "Agent PAYE rate is required")
    @Min(value = 0, message = "PAYE cannot be negative")
    @Max(value = 1, message = "PAYE cannot exceed 100%")
    private BigDecimal agentPaye;

    // -------------------------------
    //     Financial Snapshot
    // -------------------------------

    @NotNull(message = "Total amount paid is required")
    @PositiveOrZero(message = "Total amount paid cannot be negative")
    private BigDecimal totalAmountPaid;

    @NotNull(message = "Base rent is required")
    @Positive(message = "Base rent must be greater than zero")
    private BigDecimal baseRent;

    @NotNull(message = "Landlord payout amount is required")
    @PositiveOrZero(message = "Landlord payout cannot be negative")
    private BigDecimal landlordPayAmount;

    @NotNull(message = "Base commission is required")
    @PositiveOrZero(message = "Base commission cannot be negative")
    private BigDecimal baseComm;

    @NotNull(message = "VAT amount is required")
    @PositiveOrZero(message = "VAT cannot be negative")
    private BigDecimal vat;

    @NotNull(message = "Commission excl. VAT is required")
    @PositiveOrZero(message = "Commission excl. VAT cannot be negative")
    private BigDecimal commExclVat;

    @NotNull(message = "Company commission is required")
    @PositiveOrZero(message = "Company commission cannot be negative")
    private BigDecimal companyComm;

    @NotNull(message = "Agent gross commission is required")
    @PositiveOrZero(message = "Agent gross commission cannot be negative")
    private BigDecimal agentGrossComm;

    @NotNull(message = "PAYE amount is required")
    @PositiveOrZero(message = "PAYE amount cannot be negative")
    private BigDecimal payeAmount;

    @NotNull(message = "Agent nett commission is required")
    @PositiveOrZero(message = "Agent nett commission cannot be negative")
    private BigDecimal agentNettComm;

    // -------------------------------
    //     Optional Manual Entries
    // -------------------------------

    @PositiveOrZero(message = "Lease fee cannot be negative")
    private BigDecimal leaseFee = BigDecimal.ZERO;

    @PositiveOrZero(message = "Lease fee agent portion cannot be negative")
    private BigDecimal leaseFeeAgentPortion = BigDecimal.ZERO;

    @PositiveOrZero(message = "Lease fee office portion cannot be negative")
    private BigDecimal leaseFeeOfficePortion = BigDecimal.ZERO;

    @PositiveOrZero(message = "Deposit cannot be negative")
    private BigDecimal deposit = BigDecimal.ZERO;

    // -------------------------------
    //     Nested Structures
    // -------------------------------

    private List<AdjustmentDto> adjustments = new ArrayList<>();

    private List<NoteDto> notes = new ArrayList<>();

    // -------------------------------
    //     Cross-Field Validation
    // -------------------------------

    @AssertTrue(message = "Agent split and office split must add up to 100% (1.0)")
    public boolean isSplitValid() {
        if (agentSplit == null || officeSplit == null) {
            return true;
        }
        return agentSplit.add(officeSplit).compareTo(BigDecimal.ONE) == 0;
    }

    @AssertTrue(message = "If updating lease fees, all portions must be provided and sum to total lease fee")
    public boolean isLeaseFeeValid() {
        if (leaseFee == null && leaseFeeAgentPortion == null && leaseFeeOfficePortion == null) {
            return true;
        }
        if (leaseFee == null || leaseFeeAgentPortion == null || leaseFeeOfficePortion == null) {
            return false; // Fail early if partial updates risk data corruption
        }
        return leaseFeeAgentPortion.add(leaseFeeOfficePortion).compareTo(leaseFee) == 0;
    }

    @AssertTrue(message = "Commission excl. VAT must equal the sum of agent gross commission and company commission")
    public boolean isCompanyAndAgentCommValid() {
        if (commExclVat == null || agentGrossComm == null || companyComm == null) {
            return true;
        }
        return commExclVat.compareTo(agentGrossComm.add(companyComm)) == 0;
    }

    @AssertTrue(message = "Base commission must equal commission excl. VAT plus VAT")
    public boolean isBaseCommValid() {
        if (baseComm == null || commExclVat == null || vat == null) {
            return true;
        }
        return baseComm.compareTo(commExclVat.add(vat)) == 0;
    }

    @AssertTrue(message = "Agent gross commission must equal agent nett commission plus PAYE amount")
    public boolean isAgentNettCommValid() {
        if (agentGrossComm == null || agentNettComm == null || payeAmount == null) {
            return true;
        }
        return agentGrossComm.compareTo(agentNettComm.add(payeAmount)) == 0;
    }

    @AssertTrue(message = "Base rent must equal the landlord payout plus base commission")
    public boolean isBaseRentValid() {
        if (baseRent == null || landlordPayAmount == null || baseComm == null) {
            return true;
        }
        return baseRent.compareTo(landlordPayAmount.add(baseComm)) == 0;
    }
}