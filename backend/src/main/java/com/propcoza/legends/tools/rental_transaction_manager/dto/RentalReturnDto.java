package com.propcoza.legends.tools.rental_transaction_manager.dto;

import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;

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
        String agentName, // resolved from Agent entity in mapper

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

        double rentalCommissionPercent,
        double officeSplit,
        double agentSplit,   // derived, but returned for display convenience
        double agentPaye,
        boolean vatRegistered,

        // -------------------------------
        //    Audit
        // -------------------------------

        String createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {}