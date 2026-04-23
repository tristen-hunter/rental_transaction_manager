package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class InstanceReturnDto {

    private UUID id;
    private UUID rentalId;
    private LocalDate billingPeriod;
    private LocalDate actualPaymentDate;

    // -------------------------------
    //     Commission Percentages
    // -------------------------------

    private double rentalCommissionPercent;
    private double officeSplit;
    private double agentPaye;

    // -------------------------------
    //     Financial Snapshot
    // -------------------------------

    private BigDecimal baseRent;
    private BigDecimal totalAmountPayed;
    private BigDecimal landlordPayAmount;
    private BigDecimal baseComm;
    private BigDecimal vat;
    private BigDecimal commExclVat;
    private BigDecimal companyComm;
    private BigDecimal agentGrossComm;
    private BigDecimal payeAmount;
    private BigDecimal agentNettComm;

    // -------------------------------
    //     Lease Fee
    // -------------------------------

    private BigDecimal leaseFee;
    private BigDecimal leaseFeeAgentPortion;
    private BigDecimal leaseFeeOfficePortion;

    // -------------------------------
    //     Optional Manual Entries
    // -------------------------------

    private BigDecimal deposit;

    // -------------------------------
    //     Instance Metadata
    // -------------------------------

    private InstanceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}