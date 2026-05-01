package com.propcoza.legends.tools.rental_transaction_manager.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class AgentUpdateDto {
    private UUID id;

    private String fullName;

    private String email;

    private String bankName;

    private String accountNumber;

    private String branchCode;

    private Boolean isActive;

    private LocalDateTime updatedAt;
}
