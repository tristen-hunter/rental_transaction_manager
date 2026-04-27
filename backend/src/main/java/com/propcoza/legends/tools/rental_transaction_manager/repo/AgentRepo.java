package com.propcoza.legends.tools.rental_transaction_manager.repo;

import com.propcoza.legends.tools.rental_transaction_manager.common.utils.AgentIdDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentRepo extends JpaRepository<Agent, UUID> {

    // Test if agent exists by email
    boolean existsByEmail(String email);

    @Query("SELECT new com.propcoza.legends.tools.rental_transaction_manager.common.utils.AgentIdDto(a.id, a.fullName) FROM Agent a")
    List<AgentIdDto> findAllProjectedBy();

    // returns a list of all agents whose isActive == True
    List<Agent> findByIsActiveTrue();

    // Loads rentals by agent without loading entire agent object
    // List<Rental> findByAgentId(UUID agentId);

    @Query("SELECT a from Agent a LEFT JOIN FETCH a.rentals WHERE a.id = :id")
    Optional<Agent> findByIdWithRentals(@Param("id") UUID id)
;}
