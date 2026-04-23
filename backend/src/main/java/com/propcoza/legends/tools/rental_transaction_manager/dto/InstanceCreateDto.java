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

    @PositiveOrZero
    private double rentalCommissionPercent;

    @PositiveOrZero
    private double officeSplit;

    @PositiveOrZero
    private double agentPaye;

    // -------------------------------
    //     Financial Snapshot
    // -------------------------------

    @NotNull
    @Positive
    private BigDecimal baseRent;

    @PositiveOrZero
    private BigDecimal totalAmountPayed;

    @PositiveOrZero
    private BigDecimal landlordPayAmount;

    @PositiveOrZero
    private BigDecimal baseComm;

    @PositiveOrZero
    private BigDecimal vat;

    @PositiveOrZero
    private BigDecimal commExclVat;

    @PositiveOrZero
    private BigDecimal companyComm;

    @PositiveOrZero
    private BigDecimal agentGrossComm;

    @PositiveOrZero
    private BigDecimal payeAmount;

    @PositiveOrZero
    private BigDecimal agentNettComm;

    // -------------------------------
    //     Optional Manual Entries
    // -------------------------------

    @PositiveOrZero
    private BigDecimal leaseFee;

    @PositiveOrZero
    private BigDecimal leaseFeeAgentPortion;

    @PositiveOrZero
    private BigDecimal leaseFeeOfficePortion;

    @PositiveOrZero
    private BigDecimal deposit;
}