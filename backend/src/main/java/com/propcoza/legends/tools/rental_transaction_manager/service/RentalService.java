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
import org.jspecify.annotations.NonNull;
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

    /**
     * @param dto
     * This is the JSON data passed from the Rental Creation form, containing all neccessary fields
     * @return
     * A return Dto is given back to display it on the UI after creation.
     * This also allows usage
     */
    @Transactional
    public RentalReturnDto createRental(@NonNull RentalCreateDto dto){
        // 1. Fetch Agent first (Fail fast)
        Agent agent = agentRepo.findById(dto.agentId())
                .orElseThrow(() -> new EntityNotFoundException("Agent not found"));

        if (rentalRepo.existsByAgentAndTenantNameAndStartDate(
                agent,
                dto.tenantName(),
                dto.paymentDate())) {
            throw new RuntimeException("A rental record already exists for this tenant/agent on this date.");
        }

        // 2. Map to Entity
        RentalCreateDto normalizedDto = NormalizationUtils.normalizeRentalCreateDto(dto);
        Rental rental = RentalMapper.toEntity(normalizedDto, agent);

        // 3. Persist to get the UUID and managed state
        Rental savedRental = rentalRepo.save(rental);

        // 4. Generate the initial instance
        // Since this is @Transactional, just adding to the list is enough
        LocalDate firstBillingPeriod = savedRental.getPaymentDate().withDayOfMonth(1);
        /// generateMonthlyInstance(savedRental, firstBillingPeriod);

        // 5. Final save is often unnecessary due to Dirty Checking,
        // but return the mapped DTO
        return RentalMapper.toReturnDto(savedRental);
    }

    /**
     * this returns a list of all MASTER rentals with a status filter
     */
    @Transactional
    public List<RentalReturnDto> getRentalsByStatus(RentalStatus status){
        List<Rental> entities = rentalRepo.findByStatus(status);

        return RentalMapper.toReturnDtoList(entities);
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