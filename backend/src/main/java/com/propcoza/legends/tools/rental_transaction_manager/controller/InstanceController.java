package com.propcoza.legends.tools.rental_transaction_manager.controller;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceUpdateDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import com.propcoza.legends.tools.rental_transaction_manager.service.InstanceService;
import com.propcoza.legends.tools.rental_transaction_manager.service.RentalService;
import jakarta.validation.Valid;
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
    public InstanceReturnDto createInitialDraft(@PathVariable UUID rentalId) {
        return instanceService.saveInitialDraft(rentalId);
    }

    @GetMapping
    public List<InstanceReturnDto> allDraftInstances(@RequestParam(name = "status") InstanceStatus status) {
        return instanceService.getAllDraftInstances(status);
    }

    @PutMapping("/{instanceId}/update")
    public void updateInstance(
            @PathVariable UUID instanceId,
            @Valid @RequestBody InstanceUpdateDto dto
    ) {
        instanceService.updateInstance(instanceId, dto);
    }

    @DeleteMapping("/{instanceId}")
    public void deleteInstances(@PathVariable UUID instanceId) {
        instanceService.deleteInstance(instanceId);
    }


    @PostMapping("/bulk-create")
    public ResponseEntity<List<InstanceReturnDto>> bulkGenerateForActiveRentals(){
        List<InstanceReturnDto> dtos = instanceService.bulkGenerateForActiveRentals();
        return ResponseEntity.ok(dtos);
    }
}
