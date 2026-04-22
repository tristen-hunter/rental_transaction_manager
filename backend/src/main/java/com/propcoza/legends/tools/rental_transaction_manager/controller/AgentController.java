package com.propcoza.legends.tools.rental_transaction_manager.controller;

import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.service.AgentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @PostMapping
    public ResponseEntity<AgentReturnDto> createAgent(@Valid @RequestBody AgentCreateDto agentCreateDto){
        AgentReturnDto createdAgent = agentService.createAgent(agentCreateDto);
        return new ResponseEntity<>(createdAgent, HttpStatus.CREATED);
    }

    @GetMapping
    public List<AgentReturnDto> getAllAgents(){
        return agentService.getAllAgents();
    }
}
