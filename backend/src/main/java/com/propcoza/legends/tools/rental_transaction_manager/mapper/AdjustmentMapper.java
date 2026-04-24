package com.propcoza.legends.tools.rental_transaction_manager.mapper;

import com.propcoza.legends.tools.rental_transaction_manager.dto.AdjustmentDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Adjustment;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalInstanceRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor // Automatically injects the repository
public class AdjustmentMapper {

    private final RentalInstanceRepo rentalInstanceRepo;

    /**
     * Maps DTO to Entity and validates that the RentalInstance exists.
     */
    public Adjustment toEntity(AdjustmentDto dto) {
        if (dto == null) return null;

        RentalInstance rentalInstance = rentalInstanceRepo.findById(dto.getRentalInstanceId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "RentalInstance not found with ID: " + dto.getRentalInstanceId()));

        Adjustment adjustment = new Adjustment();
        adjustment.setRentalInstance(rentalInstance);
        adjustment.setType(dto.getType());
        adjustment.setAmount(dto.getAmount());
        adjustment.setReason(dto.getReason());

        return adjustment;
    }

    /**
     * Maps a list of DTOs to Entities.
     */
    public List<Adjustment> toEntityList(List<AdjustmentDto> dtos) {
        if (dtos == null) return null;

        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}