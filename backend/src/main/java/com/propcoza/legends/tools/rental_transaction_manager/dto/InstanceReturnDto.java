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
    //     Commission Percentages (Changed to BigDecimal to avoid unboxing crashes)
    // -------------------------------
    private BigDecimal rentalCommissionPercent;
    private BigDecimal officeSplit;
    private BigDecimal agentSplit;
    private BigDecimal agentPaye;

    // -------------------------------
    //     Financial Snapshot
    // -------------------------------
    private BigDecimal baseRent;
    private BigDecimal totalAmountPaid;
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
    //     Instance Metadata (Type-safe Enum or String, without JPA annotation)
    // -------------------------------
    private InstanceStatus status;

    private String createdBy; // Fixed naming convention capitalization
    private LocalDateTime createdAt;
    private String lastModifiedBy;
    private LocalDateTime lastModifiedAt;

    // Consider adding these if the frontend needs adjustment/note info on return
    // private List<AdjustmentReturnDto> adjustments;
    // private List<NoteReturnDto> notes;
}