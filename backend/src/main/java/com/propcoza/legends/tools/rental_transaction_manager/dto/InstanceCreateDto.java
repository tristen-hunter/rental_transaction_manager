package com.propcoza.legends.tools.rental_transaction_manager.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class InstanceCreateDto {

    @NotNull
    private UUID rentalId;

    @NotNull
    private LocalDate billingPeriod;

    private LocalDate actualPaymentDate;

    // -------------------------------
    //     Commission Percentages
    // -------------------------------

    /// This is the comm on the rent (usually 10% + VAT)
    /// some Landlords do not pay VAT - this is handled at the office level
    /// SO when vatRegistered == false then this will be a flat 10% and VAT = 0
    @PositiveOrZero
    private double rentalCommissionPercent;

    /// this is how much the office gets out of the commExclVat
    @PositiveOrZero
    private double officeSplit;

    /// this is how much PAYE the agent pays on their gross comm
    @PositiveOrZero
    private double agentPaye;

    // -------------------------------
    //     Financial Snapshot
    // -------------------------------

    /// baseRent plus all adjustments (set to baseRent by default)
    @PositiveOrZero
    private BigDecimal totalAmountPayed;

    /// this is the amount the tenant pays each month (excluding adjustments: totalAmountPayed - adjustments)
    /// However this is calculated first, totalAmountPayed - adjustments this is merely a relationship
    @NotNull
    @Positive
    private BigDecimal baseRent;

    /// This is the baseRent minus the baseComm
    @PositiveOrZero
    private BigDecimal landlordPayAmount;

    /// this is calculated before landlordPayAmount
    /// It is the office split + vat + agent gross comm
    @PositiveOrZero
    private BigDecimal baseComm;

    /// Some deals do not include VAT (they are handled differently)
    /// IF the deal is marked as vatRegistered == false, then VAT must equal 0
    /// ELSE vat = baseComm - (baseComm / 1.15)
    @PositiveOrZero
    private BigDecimal vat;

    /// commExclVat is baseComm - vat
    /// IF vatRegistered == false THEN this is equal to baseComm
    /// ELSE baseComm - vat = commExclVat
    @PositiveOrZero
    private BigDecimal commExclVat;

    /// companyComm is the offices portion of the commExclVat
    /// commExclVat * officeSplit (either 30 or 20%)
    @PositiveOrZero
    private BigDecimal companyComm;

    /// agentGrossComm is commExclVat minus the companyComm (usually 70% of commExclVat)
    @PositiveOrZero
    private BigDecimal agentGrossComm;

    /// payeAmount refers to the agentGrossComm * agentPaye (usually 18, but sometimes 25 - manually entered by the admin)
    @PositiveOrZero
    private BigDecimal payeAmount;

    /// = agentGrossComm minus payeAmount
    @PositiveOrZero
    private BigDecimal agentNettComm;

    // -------------------------------
    //     Optional Manual Entries
    // -------------------------------

    /**
     * These are manually entered or kept as 0, they are non-standard but do apply in some cases
     * only used on the first month, so they are always 0 except when the admin changes them manually before saving
     */
    @PositiveOrZero
    private BigDecimal leaseFee;

    @PositiveOrZero
    private BigDecimal leaseFeeAgentPortion;

    @PositiveOrZero
    private BigDecimal leaseFeeOfficePortion;

    @PositiveOrZero
    private BigDecimal deposit;
}