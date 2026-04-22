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

        return RentalReturnDto.builder()
                .agentName(rental.getAgent() != null ? rental.getAgent().getFullName() : "N/A")
                .address(rental.getAddress())
                .tenantName(rental.getTenantName())
                .paymentDate(rental.getPaymentDate())
                .status(rental.getStatus())

                .totalRentReceived(rental.getTotalRentReceived())
                .landlordName(rental.getLandlordName())
                .landlordBankName(rental.getLandlordBankName())
                .landlordAccNo(rental.getLandlordAccNo())
                .landlordBranch(rental.getLandlordBranch())
                .companyComm(rental.getCompanyComm())
                .agentGrossComm(rental.getAgentGrossComm())
                .payeAmount(rental.getPayeAmount())
                .agentNettComm(rental.getAgentNettComm())
                .landlordPayAmount(rental.getLandlordPayAmount())
                .vat(rental.getVat())

                .createdBy(rental.getCreatedBy())
                .createdAt(rental.getCreatedAt())
                .updatedAt(rental.getUpdatedAt())
                .build();
    }

    public List<RentalReturnDto> toDtoList(@NonNull List<Rental> rentals){
        return rentals.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
