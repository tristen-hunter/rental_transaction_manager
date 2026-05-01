package com.propcoza.legends.tools.rental_transaction_manager.repo;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceUpdateDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RentalInstanceRepo extends JpaRepository<RentalInstance, UUID> {

    // Returns a rental with all adjustments and notes initialized
    @Query("SELECT r FROM RentalInstance r LEFT JOIN FETCH r.adjustments LEFT JOIN FETCH r.notes WHERE r.id = :id")
    Optional<RentalInstance> findByIdWithDetails(@Param("id") UUID id);


    // Find if an instance already exists
    // NOTE: billing period set to the first day in service layer (createRental)
    boolean existsByRentalAndActualPaymentDate(Rental rental, LocalDate paymentDate);

    // Get all Instances associated with a rental (master)
    List<RentalInstance> findByRental_Id(UUID rentalId);

    // Find a specific instance by its ID
    @NonNull Optional<RentalInstance> findById(UUID id);


    /// Locate all instances by status
    List<RentalInstance> findByStatus(InstanceStatus status);
}