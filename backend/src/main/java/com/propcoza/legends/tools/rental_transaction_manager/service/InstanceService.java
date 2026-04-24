package com.propcoza.legends.tools.rental_transaction_manager.service;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.InstanceStatus;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.InstanceMapper;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalInstanceRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
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
        System.out.println("RENTAL ID = " + rentalId);
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
        newDto.setAgentPaye(rental.getAgentPaye());
        newDto.setBaseRent(rental.getBaseRent());

        ///  Here I need to map the variables that are not constant
        // Variables
        BigDecimal totalAdjustments = BigDecimal.ZERO;
        // 1. Calculate the Total Commission (VAT Inclusive)
        BigDecimal baseComm = rental.getBaseRent()
                .multiply(BigDecimal.valueOf(rental.getRentalCommissionPercent()))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal vat = BigDecimal.ZERO;
        BigDecimal commExclVat;

        // 2. Extract VAT from the Commission, not the Rent
        if (rental.getVatRegistered()) {
            // Standard "Inside" VAT calc: Total / 1.15
            commExclVat = baseComm.divide(BigDecimal.valueOf(1.15), 2, RoundingMode.HALF_UP);
            vat = baseComm.subtract(commExclVat);
        } else {
            commExclVat = baseComm;
        }
        // 3. Split the NET (Excl VAT) amount
        BigDecimal agentGrossComm = commExclVat.multiply(BigDecimal.valueOf(rental.getAgentSplit()))
                .setScale(2, RoundingMode.HALF_UP);

        // If officeSplit is 0.3, this gives the 30% portion
        BigDecimal companyComm = commExclVat.subtract(agentGrossComm);

        // 4. Tax
        BigDecimal payeAmount = agentGrossComm.multiply(BigDecimal.valueOf(rental.getAgentPaye()))
                .setScale(2, RoundingMode.HALF_UP);


        // Assignment
        newDto.setTotalAmountPaid(rental.getBaseRent().add(totalAdjustments)); /// INCOMPLETE
        newDto.setBaseRent(rental.getBaseRent());
        newDto.setLandlordPayAmount(rental.getBaseRent().subtract(baseComm));
        newDto.setBaseComm(baseComm);
        newDto.setVat(vat);
        newDto.setCommExclVat(commExclVat);
        newDto.setCompanyComm(commExclVat.subtract(agentGrossComm));
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
}
