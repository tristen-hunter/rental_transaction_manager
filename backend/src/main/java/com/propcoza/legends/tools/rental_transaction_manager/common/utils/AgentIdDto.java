package com.propcoza.legends.tools.rental_transaction_manager.common.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentIdDto {

    private UUID id;

    private String fullName;
}
