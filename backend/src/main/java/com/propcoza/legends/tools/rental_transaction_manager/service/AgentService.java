package com.propcoza.legends.tools.rental_transaction_manager.service;

import com.propcoza.legends.tools.rental_transaction_manager.common.utils.AgentIdDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentUpdateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.AgentMapper;
import com.propcoza.legends.tools.rental_transaction_manager.mapper.RentalMapper;
import com.propcoza.legends.tools.rental_transaction_manager.repo.AgentRepo;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepo agentRepo;
    private final AgentMapper agentMapper;
    private final RentalRepo rentalRepo;

    // [ADMIN]
    @Transactional
    public AgentReturnDto createAgent(@NonNull AgentCreateDto dto){

        // 1. validate Agent doesn't exist yet
        String normalizedEmail = dto.getEmail().trim().toLowerCase();
        if(agentRepo.existsByEmail(normalizedEmail)){
            throw new IllegalArgumentException("Email already exists");
        }

        // 2. Instantiate a new Agent
        Agent newAgent = new Agent();

        // --- NORMALIZATION START ---

        // Name: Title Case (e.g., "john smith" -> "John Smith")
        // Trimming removes accidental trailing spaces from copy-pasting
        String normalizedName = capitalizeName(dto.getFullName().trim());

        // Bank Name: Uppercase or Title Case
        // Since you'll have "FNB" or "Absa", Title Case is usually safer
        String normalizedBank = capitalizeName(dto.getBankName().trim());

        // Account & Branch: Strictly digits (Remove spaces if the user typed "123 456")
        String cleanAccount = dto.getAccountNumber().replaceAll("\\s+", "");
        String cleanBranch = dto.getBranchCode().replaceAll("\\s+", "");

        // --- NORMALISATION END ---

        newAgent.setFullName(normalizedName);
        newAgent.setEmail(normalizedEmail);
        newAgent.setBankName(normalizedBank);
        newAgent.setAccountNumber(cleanAccount);
        newAgent.setBranchCode(cleanBranch);

        // 3, Pass Agent entity to the repo to be saved
        Agent savedAgent = agentRepo.save(newAgent);

        return AgentReturnDto.builder()
                .id(savedAgent.getId())
                .fullName(savedAgent.getFullName())
                .bankName(savedAgent.getBankName())
                .accountNumber(savedAgent.getAccountNumber())
                .branchCode(savedAgent.getBranchCode())
                .isActive(savedAgent.getIsActive())
                .createdAt(savedAgent.getCreatedAt())
                .updatedAt(savedAgent.getUpdatedAt())
                .totalRentals(0) // Initialize to 0 for a brand-new agent
                .build();
    }

    public List<AgentReturnDto> getAllAgents(){
        return agentMapper.toDtoList(agentRepo.findAll());
    }

    @Transactional
    public List<RentalReturnDto> getRentalsByAgentId(UUID agentId){
        List<Rental> entities = rentalRepo.getRentalsByAgent_Id(agentId);

        return RentalMapper.toReturnDtoList(entities);
    }

    @Transactional
    public void updateAgent(AgentUpdateDto dto){
        Agent existingAgent = agentRepo.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + dto.getId()));

        Agent updatedAgent = AgentMapper.updateEntityFromDto(dto, existingAgent);
        agentRepo.save(updatedAgent);
    }


    // Helper method for Title Case (standard Java or use Apache Commons WordUtils)
    private String capitalizeName(String str) {
        if (str == null || str.isEmpty()) return str;
        String[] words = str.toLowerCase().split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        return result.toString().trim();
    }

    // UTIL - return all agent names and ID's
    public List<AgentIdDto> getAllAgentIds(){
        return agentRepo.findAllProjectedBy();
    }
}
