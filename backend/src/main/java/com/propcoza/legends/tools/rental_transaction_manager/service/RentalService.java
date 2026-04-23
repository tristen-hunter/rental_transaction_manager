package com.propcoza.legends.tools.rental_transaction_manager.service;

import com.propcoza.legends.tools.rental_transaction_manager.common.utils.NormalizationUtils;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.*;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.RentalMapper;
import com.propcoza.legends.tools.rental_transaction_manager.repo.AgentRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalInstanceRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepo rentalRepo;
    private final AgentRepo agentRepo;
    private final RentalInstanceRepo instanceRepo;
    private final RentalMapper rentalMapper;

    /**
     * @param dto
     * This is the JSON data passed from the Rental Creation form, containing all neccessary fields
     * @return
     * A return Dto is given back to display it on the UI after creation.
     * This also allows usage
     */
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
        newRental.setVat(normalizedDto.getVat());

        // Save to the repo
        Rental savedRental = rentalRepo.save(newRental);

        /// this generates a new instance (billingPeriod = yyyy-mm-01)
        LocalDate firstBillingPeriod =
                savedRental.getPaymentDate().withDayOfMonth(1);

        generateMonthlyInstance(savedRental, firstBillingPeriod);

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
                .vat(savedRental.getVat())

                .createdBy(savedRental.getCreatedBy())
                .createdAt(savedRental.getCreatedAt())
                .updatedAt(savedRental.getUpdatedAt())
                .build();
    }

    /**
     *
     * @param rental
     * This passes the actual rental MASTER object created by the admin
     * @param billingPeriod
     * here we take the paymentDate and normalise it to the first day of the month for simplified lookups
     */
    @Transactional
    public void generateMonthlyInstance(Rental rental, LocalDate billingPeriod){
        if(instanceRepo.existsByRentalAndBillingPeriod(rental, billingPeriod)){
            return;
        }

        RentalInstance instance = new RentalInstance();
        instance.setRental(rental);
        instance.setBillingPeriod(billingPeriod);
        instance.setStatus(InstanceStatus.DRAFT);

        // SNAPSHOT: Copying current master values to the instance
        instance.setTotalRentReceived(rental.getTotalRentReceived());
        instance.setCompanyComm(rental.getCompanyComm());
        instance.setAgentGrossComm(rental.getAgentGrossComm());
        instance.setPayeAmount(rental.getPayeAmount());
        instance.setAgentNettComm(rental.getAgentNettComm());
        instance.setLandlordPayAmount(rental.getLandlordPayAmount());
        instance.setVat(rental.getVat());

        instanceRepo.save(instance);
    }

    /**
     * this returns a list of all MASTER rentals with no filters
     */
    @Transactional
    public List<RentalReturnDto> getAllRentals(){
        return rentalMapper.toDtoList(rentalRepo.findAll());
    }

    /**
     * @param agentId
     * Here we flatten the Agent object to extract the Id, then that is passed to a repo call
     * @return
     * We return the Dto after using the mapper to map the list of rentslsd returned by the DB
     */
    @Transactional
    public List<RentalReturnDto> getRentalsByAgentId(UUID agentId){
        return rentalMapper.toDtoList(rentalRepo.getRentalsByAgent_Id(agentId));
    }

    /**
     * @param rentalId
     * Flattened Rental object passed to a DB call
     * @return
     * A list of all rental instances is returned with no filters
     */
    @Transactional
    public List<RentalInstance> findByRental_Id(UUID rentalId){
        return instanceRepo.findByRental_Id(rentalId);
    }
}