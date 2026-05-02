package com.propcoza.legends.tools.rental_transaction_manager.common.config;

import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.AuditorAware;
import java.util.Optional;

public class MvpAuditorAware implements AuditorAware<String> {

    @Override
    public @NonNull Optional<String> getCurrentAuditor() {
        // This pulls the "SYSTEM" default or whatever user you manually set
        return Optional.ofNullable(UserContext.getCurrentUser());
    }
}