package com.propcoza.legends.tools.rental_transaction_manager.service;

import com.propcoza.legends.tools.rental_transaction_manager.common.utils.NormalizationUtils;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalUpdateDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.*;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.InstanceMapper;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.RentalMapper;
import com.propcoza.legends.tools.rental_transaction_manager.repo.AgentRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalInstanceRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
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

        // 4. Final save is often unnecessary due to Dirty Checking,
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
    public List<InstanceReturnDto> findByRental_Id(UUID rentalId){
        List<RentalInstance> instances = instanceRepo.findByRental_Id(rentalId);
        return InstanceMapper.toReturnDtoList(instances);
    }


    /// pass ID through the URL params
    @Transactional
    public void updateRental(@NonNull UUID  rentalId, RentalUpdateDto dto){
        Rental existingRental = rentalRepo.findById(rentalId)
                .orElseThrow(() -> new EntityNotFoundException("Rental not found"));

        // Update agent relationship if the agent ID has changed
        if (!existingRental.getAgent().getId().equals(dto.getAgentId())) {
            Agent newAgent = agentRepo.findById(dto.getAgentId())
                    .orElseThrow(() -> new EntityNotFoundException("Agent not found"));
            existingRental.setAgent(newAgent);
        }

        Rental UpdatedRental = RentalMapper.updateEntityFromDto(dto, existingRental);
    }

    @Transactional
    public void deleteRental(@NonNull UUID rentalId){
        Rental selectedRental = rentalRepo.findById(rentalId)
                .orElseThrow(() -> new EntityNotFoundException("Rental not found"));
        rentalRepo.delete(selectedRental);
    }
}