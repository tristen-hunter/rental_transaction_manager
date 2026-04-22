package com.propcoza.legends.tools.rental_transaction_manager.controller;

import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<RentalReturnDto> createAgent(@Valid @RequestBody RentalCreateDto rentalCreateDto){
        RentalReturnDto createdRental = rentalService.createRental(rentalCreateDto);
        return new ResponseEntity<>(createdRental, HttpStatus.CREATED);
    }
}
