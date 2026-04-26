package com.propcoza.legends.tools.rental_transaction_manager.mapper;

import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AgentMapper {

    public AgentReturnDto toDto(Agent agent) {
        if (agent == null) {
            return null;
        }

        return AgentReturnDto.builder()
                .id(agent.getId())
                .fullName(agent.getFullName())
                .email(agent.getEmail())
                .bankName(agent.getBankName())
                .accountNumber(agent.getAccountNumber())
                .branchCode(agent.getBranchCode())
                .isActive(agent.getIsActive())
                .createdAt(agent.getCreatedAt())
                .updatedAt(agent.getUpdatedAt())
                // Check if the list is null to avoid NullPointerException
                .totalRentals(agent.getRentals() != null ? agent.getRentals().size() : 0)
                .build();
    }

    public List<AgentReturnDto> toDtoList(List<Agent> agents) {
        return agents.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}