package com.propcoza.legends.tools.rental_transaction_manager.service;

import com.propcoza.legends.tools.rental_transaction_manager.common.utils.NormalizationUtils;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import com.propcoza.legends.tools.rental_transaction_manager.repo.AgentRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepo rentalRepo;
    private final AgentRepo agentRepo;

    @Transactional
    public RentalReturnDto createRental(RentalCreateDto dto){
        // 1. Instantiate the new object and normalize all variables
        RentalCreateDto normalizedDto = NormalizationUtils.normalizeRentalCreateDto(dto);

        Rental newRental = new Rental();
        Agent agent = agentRepo.findById(normalizedDto.getAgentId())
                .orElseThrow(() -> new EntityNotFoundException("Agent not found"));

        // Property
        newRental.setAgent(agent);
        // Property
        newRental.setAddress(normalizedDto.getAddress());
        newRental.setTenantName(normalizedDto.getTenantName());
        // Scheduling
        newRental.setPaymentDate(normalizedDto.getPaymentDate());
        newRental.setStatus(RentalStatus.ACTIVE);
        // Financial
        newRental.setTotalRentReceived(normalizedDto.getTotalRentReceived());
        newRental.setLandlordName(normalizedDto.getLandlordName());
        newRental.setLandlordBankName(normalizedDto.getLandlordBankName());
        newRental.setLandlordAccNo(normalizedDto.getLandlordAccNo());
        newRental.setLandlordBranch(normalizedDto.getLandlordBranch());
        newRental.setCompanyComm(normalizedDto.getCompanyComm());
        // Calculate gross comm
        BigDecimal agent_gross_comm =
                Optional.ofNullable(normalizedDto.getAgentNettComm()).orElse(BigDecimal.ZERO)
                        .add(Optional.ofNullable(normalizedDto.getPayeAmount()).orElse(BigDecimal.ZERO));
        newRental.setAgentGrossComm(agent_gross_comm);

        newRental.setPayeAmount(normalizedDto.getPayeAmount());
        newRental.setAgentNettComm(normalizedDto.getAgentNettComm());
        newRental.setLandlordPayAmount(normalizedDto.getLandlordPayAmount());

        // Save to the repo
        Rental savedRental = rentalRepo.save(newRental);

        return RentalReturnDto.builder()
                .agentName(agent.getFullName())
                .address(savedRental.getAddress())
                .tenantName(savedRental.getTenantName())
                .paymentDate(savedRental.getPaymentDate())
                .status(savedRental.getStatus())

                .totalRentReceived(savedRental.getTotalRentReceived())
                .landlordName(savedRental.getLandlordName())
                .landlordBankName(savedRental.getLandlordBankName())
                .landlordAccNo(savedRental.getLandlordAccNo())
                .landlordBranch(savedRental.getLandlordBranch())
                .companyComm(savedRental.getCompanyComm())
                .agentGrossComm(savedRental.getAgentGrossComm())
                .payeAmount(savedRental.getPayeAmount())
                .agentNettComm(savedRental.getAgentNettComm())
                .landlordPayAmount(savedRental.getLandlordPayAmount())

                .createdBy(savedRental.getCreatedBy())
                .createdAt(savedRental.getCreatedAt())
                .updatedAt(savedRental.getUpdatedAt())
                .build();
    }
}