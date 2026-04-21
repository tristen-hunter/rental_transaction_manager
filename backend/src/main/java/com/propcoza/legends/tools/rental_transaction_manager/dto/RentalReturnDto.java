package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RentalReturnDto {

    // Relational Info
    private String agentName; // Flattened for admin view

    // Core Rental Details
    private String address;
    private String tenantName;
    private LocalDate paymentDate;
    private RentalStatus status;

    // Financial Data
    private BigDecimal totalRentReceived;
    private String landlordName;
    private String landlordBankName;
    private String landlordAccNo;
    private String landlordBranch;
    private BigDecimal companyComm;
    private BigDecimal agentGrossComm;
    private BigDecimal payeAmount;
    private BigDecimal agentNettComm;
    private BigDecimal landlordPayAmount;

    // Audit/Logging Data
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Related Data Summaries
//    private List<AdjustmentDto> adjustments;
//    private List<NoteDto> notes;
}