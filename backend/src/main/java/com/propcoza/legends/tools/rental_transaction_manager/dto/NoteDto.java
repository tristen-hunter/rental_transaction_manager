package com.propcoza.legends.tools.rental_transaction_manager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class NoteDto {

    @NotNull(message = "Rental Instance ID is required")
    private UUID rentalInstanceId;

    @NotBlank(message = "Note description cannot be empty")
    @Size(max = 2000, message = "Note is too long (max 2000 characters)")
    private String description;
}