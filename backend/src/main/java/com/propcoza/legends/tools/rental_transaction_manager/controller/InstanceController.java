package com.propcoza.legends.tools.rental_transaction_manager.controller;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.service.InstanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instances")
@RequiredArgsConstructor
public class InstanceController {

    private final InstanceService instanceService;

    @PostMapping("/{rentalId}")
    public InstanceReturnDto instanceCreateDto(@PathVariable UUID rentalId){
        Rental newRental = instanceService.findRentalById(rentalId);

        return instanceService.saveInitialDraft(rentalId);
    }
}
