package com.propcoza.legends.tools.rental_transaction_manager.service;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceUpdateDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.InstanceMapper;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalInstanceRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InstanceService {

    private final RentalInstanceRepo instanceRepo;
    private final RentalRepo rentalRepo;
    private final InstanceMapper instanceMapper;

    @Transactional
    public Rental findRentalById(@NonNull UUID rentalId){
        return rentalRepo.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    /**
     * @param rental
     * this is the entity that needs to be mapped
     * @return
     * returns a DTO to be edited by the user.
     *
     * this fundtion is called once everytime a new instance is created - after editing this DTO must be passed to a new function
     */
    @Transactional
    public InstanceCreateDto createInstanceDto(@NonNull Rental rental){
        /// 1. Map the constants from the entity to the DTO
        InstanceCreateDto newDto = new InstanceCreateDto();

        newDto.setRentalId(rental.getId());
        LocalDate firstBillingPeriod = rental.getPaymentDate().withDayOfMonth(1);
        newDto.setBillingPeriod(firstBillingPeriod);
        newDto.setActualPaymentDate(rental.getPaymentDate());
        newDto.setStatus(InstanceStatus.DRAFT);
        newDto.setRentalCommissionPercent(rental.getRentalCommissionPercent());
        newDto.setOfficeSplit(rental.getOfficeSplit());
        newDto.setAgentSplit(rental.getAgentSplit());
        newDto.setAgentPaye(rental.getAgentPaye());
        newDto.setVatRegistered(rental.getVatRegistered());
        newDto.setBaseRent(rental.getBaseRent());

        ///  Here I need to map the variables that are not constant
        // Variables
        BigDecimal totalAdjustments = BigDecimal.ZERO;

        // 1. Calculate the Total Commission (VAT Inclusive)
        BigDecimal baseComm;
        BigDecimal rawComm = rental.getBaseRent()
                .multiply(rental.getRentalCommissionPercent())
                .setScale(2, RoundingMode.HALF_UP);

        if (rental.getVatRegistered()) {
            // Add 15% on top of the raw commission
            baseComm = rawComm.multiply(BigDecimal.valueOf(1.15))
                    .setScale(2, RoundingMode.HALF_UP);
        } else {
            baseComm = rawComm;
        }

        // 2. Calculate VAT and the Net amount (commExclVat)
        BigDecimal vat = BigDecimal.ZERO;
        BigDecimal commExclVat;

        if (rental.getVatRegistered()) {
            commExclVat = rawComm; // The raw commission is the amount excluding VAT
            vat = baseComm.subtract(commExclVat);
        } else {
            commExclVat = baseComm;
        }

        // 3. Split the NET (Excl VAT) amount
        BigDecimal agentGrossComm = commExclVat.subtract(commExclVat.multiply(rental.getOfficeSplit()))
                .setScale(2, RoundingMode.HALF_UP);

        // If officeSplit is 0.3, this gives the 30% portion
        BigDecimal companyComm = commExclVat.subtract(agentGrossComm);

        // 4. Tax
        BigDecimal payeAmount = agentGrossComm.multiply(rental.getAgentPaye())
                .setScale(2, RoundingMode.HALF_UP);


        // Assignment
        newDto.setTotalAmountPaid(rental.getBaseRent().add(totalAdjustments)); /// INCOMPLETE
        newDto.setBaseRent(rental.getBaseRent());
        newDto.setLandlordPayAmount(rental.getBaseRent().subtract(baseComm));
        newDto.setBaseComm(baseComm);
        newDto.setVat(vat);
        newDto.setCommExclVat(commExclVat);
        newDto.setCompanyComm(companyComm);
        newDto.setAgentGrossComm(agentGrossComm);
        newDto.setPayeAmount(payeAmount);
        newDto.setAgentNettComm(agentGrossComm.subtract(payeAmount));

        newDto.setLeaseFee(BigDecimal.ZERO);
        newDto.setLeaseFeeAgentPortion(BigDecimal.ZERO);
        newDto.setLeaseFeeOfficePortion(BigDecimal.ZERO);
        newDto.setDeposit(BigDecimal.ZERO);

        // Explicitly initializing as empty lists
        newDto.setAdjustments(new ArrayList<>());
        newDto.setNotes(new ArrayList<>());

        return newDto;
    }

    @Transactional
    public InstanceReturnDto saveInitialDraft(@NonNull UUID rentalId) {
        // 1. Getting the rental entity
        Rental rental = rentalRepo.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        // 2. Generate the DTO logic (Calculates your 10%, VAT, etc.)
        InstanceCreateDto newDtoDraft = createInstanceDto(rental);

        // 3. Map DTO -> Entity
        RentalInstance instance = instanceMapper.toEntity(newDtoDraft);

        // CRITICAL: Link the instance back to the parent Rental
        instance.setRental(rental);
        instance.setStatus(InstanceStatus.DRAFT);

        // 4. Save to DB
        RentalInstance savedInstance = instanceRepo.save(instance);

        // 5. map to DTO and return
        return InstanceMapper.toReturnDto(savedInstance);
    }

    /**
     * Gets ALL current ACTIVE rentals
     * @return A List item
     */
    @Transactional
    public List<Rental> getAllActiveRentals(){
        return rentalRepo.findByStatus(RentalStatus.ACTIVE);
    };

    @Transactional
    public List<InstanceReturnDto> getAllDraftInstances(InstanceStatus status) {
        List<RentalInstance> instanceList = instanceRepo.findByStatus(status);
        return InstanceMapper.toReturnDtoList(instanceList);
    };

    /// Save an edited DTO
    @Transactional
    public void updateInstance(@NonNull UUID instanceId,  InstanceUpdateDto dto){
        RentalInstance existingInstance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new EntityNotFoundException("RentalInstance not found with ID: " + instanceId));
        InstanceMapper.updateEntityFromDto(dto, existingInstance);
    }

    @Transactional
    public void deleteInstance(@NonNull UUID instanceId) {
        RentalInstance selectedInstance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new EntityNotFoundException("RentalInstance not found with ID: " + instanceId));
        instanceRepo.delete(selectedInstance);
    }

    /// Deprecated
    @Transactional
    public List<InstanceReturnDto> saveAllInitialDrafts(@NonNull List<Rental> rentals){
        // 1. Process all rentals into entities in-memory
        List<RentalInstance> instancesToSave = rentals.stream()
                .map(rental -> {
                    // Reuse your existing math logic
                    InstanceCreateDto newDtoDraft = createInstanceDto(rental);

                    // Map to Entity
                    RentalInstance instance = instanceMapper.toEntity(newDtoDraft);

                    // Set relationships and metadata
                    instance.setRental(rental);
                    instance.setStatus(InstanceStatus.DRAFT);

                    return instance;
                })
                .toList();

        // 2. Batch Save (MUCH faster than saving inside the loop)
        List<RentalInstance> savedInstances = instanceRepo.saveAll(instancesToSave);

        // 3. Map back to Return DTOs
        return savedInstances.stream()
                .map(InstanceMapper::toReturnDto)
                .toList();
    }

    /// Find ALL instances by a rental ID
    @Transactional
    public List<InstanceReturnDto> findByRentalId(@NonNull UUID rentalId){
        List<RentalInstance> entities = instanceRepo.findByRental_Id(rentalId);

        return InstanceMapper.toReturnDtoList(entities);
    }
}
