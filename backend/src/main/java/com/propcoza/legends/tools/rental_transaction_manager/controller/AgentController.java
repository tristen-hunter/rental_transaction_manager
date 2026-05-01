package com.propcoza.legends.tools.rental_transaction_manager.controller;

import com.propcoza.legends.tools.rental_transaction_manager.common.utils.AgentIdDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentUpdateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.service.AgentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @PostMapping("/agents")
    public ResponseEntity<AgentReturnDto> createAgent(@Valid @RequestBody AgentCreateDto agentCreateDto){
        AgentReturnDto createdAgent = agentService.createAgent(agentCreateDto);
        return new ResponseEntity<>(createdAgent, HttpStatus.CREATED);
    }

    @GetMapping("/agents")
    public List<AgentReturnDto> getAllAgents(){
        return agentService.getAllAgents();
    }

    @GetMapping("/rentals/agents/{agentId}")
    public List<RentalReturnDto> getRentalsByAgentId(@PathVariable UUID agentId){
        return agentService.getRentalsByAgentId(agentId);
    }

    @GetMapping("/agents/all/agentSummary")
    public List<AgentIdDto> getAllAgentIds(){
        return agentService.getAllAgentIds();
    }

    @PutMapping("/agents")
    public void updateAgent(@Valid @RequestBody AgentUpdateDto dto){
        agentService.updateAgent(dto);
    }
}
