package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class InstanceUpdateDto {

    private UUID id;

    private UUID rentalId;

    private LocalDate billingPeriod;

    private LocalDate actualPaymentDate;

    private double rentalCommissionPercent; // for example 10%

    private double officeSplit; // office portion as a percentage (usually 30%)

    private double agentSplit;

    private double agentPaye;


    // -------------------------------
    //     Monthly Financial Snapshot (Calculated for the user, with manual over ride possible)
    // -------------------------------
    private BigDecimal totalAmountPaid; // totalRentReceived + adjustments

    private BigDecimal baseRent; // used to calculate comm and landlord portion

    private BigDecimal landlordPayAmount;

    private BigDecimal baseComm; // commission + VAT

    private BigDecimal vat; // sometimes not included based on seller profile

    private BigDecimal commExclVat; // if VAT = 0; then baseComm == commExclVat

    private BigDecimal companyComm;

    private BigDecimal agentGrossComm;

    private BigDecimal payeAmount;

    private BigDecimal agentNettComm;

    private BigDecimal leaseFee; // manually entered by Fatima

    private BigDecimal leaseFeeAgentPortion; // 50% to agent

    private BigDecimal leaseFeeOfficePortion; // 50% to office

    private BigDecimal deposit; // part of totalAmountPayed (NOT baseRent)

    // -------------------------------
    //     Instance Specific Data
    // -------------------------------

    @Enumerated(EnumType.STRING)
    private InstanceStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
