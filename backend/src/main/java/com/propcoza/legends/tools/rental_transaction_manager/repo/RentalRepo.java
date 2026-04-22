package com.propcoza.legends.tools.rental_transaction_manager.repo;

import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RentalRepo extends JpaRepository<Rental, UUID> {

    // Find rentals for a specific agent within a date range (for payslips)
    List<Rental> findByAgentIdAndPaymentDateBetween(UUID agentId, LocalDate start, LocalDate end);

    // Get all an agents rentals
    List<Rental> getRentalsByAgentId(UUID agentId);


}
