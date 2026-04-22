package com.propcoza.legends.tools.rental_transaction_manager.repo;

import com.propcoza.legends.tools.rental_transaction_manager.entity.Adjustment;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdjustmentRepo extends JpaRepository<Adjustment, UUID> {

    // Find all adjustments for an instance
    List<Adjustment> findByRentalInstance(RentalInstance rentalInstance);
}
