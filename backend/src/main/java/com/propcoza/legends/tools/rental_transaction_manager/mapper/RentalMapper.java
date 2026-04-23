package com.propcoza.legends.tools.rental_transaction_manager.mapper;

import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RentalMapper {

    public RentalReturnDto toDto(Rental rental){
        if (rental == null){
            return null;
        }

        return null;
    }

    public List<RentalReturnDto> toDtoList(@NonNull List<Rental> rentals){
        return rentals.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
