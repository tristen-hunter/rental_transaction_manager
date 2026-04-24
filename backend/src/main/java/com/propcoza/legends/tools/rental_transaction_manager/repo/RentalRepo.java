package com.propcoza.legends.tools.rental_transaction_manager.repo;

import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RentalRepo extends JpaRepository<Rental, UUID> {

    boolean existsByAgentAndTenantNameAndStartDate(
            Agent agent,
            String tenantName,
            LocalDate startDate
    );

    // Find rentals for a specific agent within a date range (for payslips)
    List<Rental> findByAgentIdAndPaymentDateBetween(UUID agentId, LocalDate start, LocalDate end);

    // Get all an agents rentals
    List<Rental> getRentalsByAgent_Id(UUID agentId);

    @NonNull Optional<Rental> findById(UUID id);

    // Locate all rentals with a certain status
    List<Rental> findByStatus(RentalStatus status);
}
