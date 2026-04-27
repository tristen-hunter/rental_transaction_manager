package com.propcoza.legends.tools.rental_transaction_manager.controller;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import com.propcoza.legends.tools.rental_transaction_manager.service.InstanceService;
import com.propcoza.legends.tools.rental_transaction_manager.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instances")
@RequiredArgsConstructor
public class InstanceController {

    private final InstanceService instanceService;
    private final RentalService rentalService;

    @PostMapping("/{rentalId}")
    public InstanceReturnDto instanceCreateDto(@PathVariable UUID rentalId) {
        Rental newRental = instanceService.findRentalById(rentalId);

        return instanceService.saveInitialDraft(rentalId);
    }

    @GetMapping
    public List<InstanceReturnDto> allDraftInstances(InstanceStatus status) {
        return instanceService.getAllDraftInstances(status);
    }

    /**
     * This function mass creates Instances of ALL current rentals (deprecated)
     */
//    @PostMapping("/pending")
//    public List<InstanceReturnDto> createAllPendingInstances(){
//        List<Rental> rentals = instanceService.getAllActiveRentals();
//
//        return instanceService.saveAllInitialDrafts(rentals);
//    }
}
