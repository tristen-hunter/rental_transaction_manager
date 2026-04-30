package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class RentalUpdateDto {

    private UUID id;
    private UUID agentId;
    private String address;
    private String tenantName;
    private LocalDate paymentDate;

    // -------------------------------
    //    Recurring Rental Fields
    // -------------------------------

    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean autoRenew = true;

    @Enumerated(EnumType.STRING)
    private RentalStatus status = RentalStatus.ACTIVE;

    // -------------------------------
    //     Landlord Info
    // -------------------------------
    private String landlordName;
    private String landlordBankName;
    private String landlordAccNo;
    private String landlordBranch;

    // -------------------------------
    //     Commission Data
    // -------------------------------

    private BigDecimal baseRent;
    private double rentalCommissionPercent;
    private double officeSplit;
    private double agentSplit;
    private double agentPaye;
    private Boolean vatRegistered = true;

    // -------------------------------
    //     Logging Data
    // -------------------------------

    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
