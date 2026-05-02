package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO returned to the client after fetching a Rental.
 * Exposes the agent as a flat summary (agentId + name) rather than
 * the full Agent entity, to avoid over-fetching across lazy boundaries.
 */
public record RentalReturnDto(

        // -------------------------------
        //    Identity
        // -------------------------------

        UUID id,

        // -------------------------------
        //    Agent Summary (flattened)
        // -------------------------------

        UUID agentId,
        String agentName,

        // -------------------------------
        //    Meta Data
        // -------------------------------

        String address,
        String tenantName,
        LocalDate paymentDate,

        // -------------------------------
        //    Recurring Rental Fields
        // -------------------------------

        LocalDate startDate,
        LocalDate endDate,
        Boolean autoRenew,
        RentalStatus status,

        // -------------------------------
        //    Landlord Info
        // -------------------------------

        String landlordName,
        String landlordBankName,
        String landlordAccNo,
        String landlordBranch,

        // -------------------------------
        //    Commission Inputs
        //    (returned so the UI can pre-fill edit forms)
        // -------------------------------

        BigDecimal baseRent,
        Double rentalCommissionPercent, // Changed to Double wrapper
        Double officeSplit,             // Changed to Double wrapper
        Double agentSplit,              // Changed to Double wrapper
        Double agentPaye,               // Changed to Double wrapper
        Boolean vatRegistered,          // Fixed: Changed boolean to Boolean wrapper

        // -------------------------------
        //    Audit
        // -------------------------------

        String createdBy,
        LocalDateTime createdAt,
        LocalDateTime lastModifiedAt,
        String lastModifiedBy
) {}