package com.propcoza.legends.tools.rental_transaction_manager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentCreateDto {

    @NotBlank(message = "Full Name is required")
    @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Full name contains invalid characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 255)
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
            message = "Please provide a valid email address"
    )
    private String email;

    @NotBlank(message = "Bank Name is required")
    @Pattern(
            regexp = "^(?i)(Absa|Capitec|FNB|First National Bank|Nedbank|Standard Bank|TymeBank|Discovery Bank|Investec|Other)$",
            message = "Please select a valid South African bank from the list"
    )
    private String bankName;

    @NotBlank(message = "Account number is required")
    @Pattern(regexp = "^\\d{7,13}$", message = "Account number must be between 7 and 13 digits")
    private String accountNumber;

    @NotBlank(message = "Branch Code is Required")
    @Pattern(regexp = "^\\d{6}$", message = "Branch code must be exactly 6 digits")
    private String branchCode;

    @Builder.Default
    private Boolean isActive = true;
}
