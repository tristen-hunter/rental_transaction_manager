package com.propcoza.legends.tools.rental_transaction_manager.common.utils;

import com.propcoza.legends.tools.rental_transaction_manager.dto.AgentCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalCreateDto;

/**
 * Utility class for normalising inbound DTO data before validation and persistence.
 *
 * Normalisation is intentionally kept separate from validation — it runs first,
 * producing clean input that validation constraints then act on.
 *
 * Call the appropriate {@code normalize*} method at the top of your service method,
 * before invoking the validator or mapping to an entity:
 *
 * <pre>{@code
 *   NormalizationUtils.normalizeAgentCreateDto(dto);
 *   // ... validate, map, persist
 * }</pre>
 *
 * All methods mutate the DTO in-place and return it for optional chaining.
 */
public final class NormalizationUtils {

    private NormalizationUtils() {
        // Utility class — not instantiable
    }

    // ------------------------------------------------------------------
    //  DTO normalisers
    // ------------------------------------------------------------------

    /**
     * Normalises an {@link AgentCreateDto} in-place.
     *
     * <ul>
     *   <li>{@code fullName}      — trimmed, title-cased</li>
     *   <li>{@code email}         — trimmed, lower-cased</li>
     *   <li>{@code bankName}      — trimmed</li>
     *   <li>{@code accountNumber} — trimmed (digits only, preserved as-is)</li>
     *   <li>{@code branchCode}    — trimmed (digits only, preserved as-is)</li>
     * </ul>
     *
     * @param dto the DTO to normalise; no-op if {@code null}
     * @return the same DTO instance, for chaining
     */
    public static AgentCreateDto normalizeAgentCreateDto(AgentCreateDto dto) {
        if (dto == null) return null;

        dto.setFullName(toTitleCase(dto.getFullName()));
        dto.setEmail(toLowerTrimmed(dto.getEmail()));
        dto.setBankName(trimSafely(dto.getBankName()));
        dto.setAccountNumber(trimSafely(dto.getAccountNumber()));
        dto.setBranchCode(trimSafely(dto.getBranchCode()));

        return dto;
    }

    /**
     * Normalises a {@link RentalCreateDto} in-place.
     *
     * <ul>
     *   <li>{@code address}          — trimmed, title-cased</li>
     *   <li>{@code tenantName}       — trimmed, title-cased</li>
     *   <li>{@code landlordName}     — trimmed, title-cased</li>
     *   <li>{@code landlordBankName} — trimmed</li>
     *   <li>{@code landlordAccNo}    — trimmed (digits only, preserved as-is)</li>
     *   <li>{@code landlordBranch}   — trimmed</li>
     * </ul>
     *
     * Numeric fields ({@code totalRentReceived}, {@code companyComm}, etc.)
     * and UUID fields ({@code agentId}) are left untouched.
     *
     * @param dto the DTO to normalise; no-op if {@code null}
     * @return the same DTO instance, for chaining
     */
    public static RentalCreateDto normalizeRentalCreateDto(RentalCreateDto dto) {
        if (dto == null) return null;

        // Records are immutable, so we create a new instance with the cleaned values
        return new RentalCreateDto(
                dto.agentId(), // UUID doesn't need normalization
                toTitleCase(dto.address()),
                toTitleCase(dto.tenantName()),
                dto.paymentDate(),
                dto.autoRenew(),
                dto.endDate(),
                toTitleCase(dto.landlordName()),
                trimSafely(dto.landlordBankName()),
                trimSafely(dto.landlordAccNo()),
                trimSafely(dto.landlordBranch()),
                dto.baseRent(),
                dto.rentalCommissionPercent(),
                dto.officeSplit(),
                dto.agentPaye(),
                dto.vatRegistered());
    }

    // ------------------------------------------------------------------
    //  Core string transforms (package-private for unit testing)
    // ------------------------------------------------------------------

    /**
     * Trims leading/trailing whitespace. Returns {@code null} if the input
     * is {@code null}; returns {@code ""} if blank after trimming.
     */
    static String trimSafely(String value) {
        return value == null ? null : value.trim();
    }

    /**
     * Trims and converts to lower-case. Safe on {@code null}.
     */
    static String toLowerTrimmed(String value) {
        return value == null ? null : value.trim().toLowerCase();
    }

    /**
     * Trims and applies English title-case: the first letter of every
     * whitespace-delimited word is upper-cased; the remainder of each word
     * is lower-cased.
     *
     * <p>Examples:
     * <pre>
     *   "john smith"         → "John Smith"
     *   "  CAPE TOWN  "      → "Cape Town"
     *   "123 main st"        → "123 Main St"
     *   "d'arcy o'brien"     → "D'arcy O'brien"
     * </pre>
     *
     * Apostrophes and hyphens inside words are preserved but do not
     * trigger an additional capital (e.g. "d'arcy" → "D'arcy").
     * If stricter handling is required for hyphenated surnames or
     * particles like "van der", extend this method accordingly.
     *
     * Safe on {@code null} and blank strings.
     */
    static String toTitleCase(String value) {
        if (value == null) return null;

        String trimmed = value.trim();
        if (trimmed.isEmpty()) return trimmed;

        String[] words = trimmed.split("\\s+");
        StringBuilder sb = new StringBuilder(trimmed.length());

        for (int i = 0; i < words.length; i++) {
            if (i > 0) sb.append(' ');
            String word = words[i];
            if (word.isEmpty()) continue;
            sb.append(Character.toUpperCase(word.charAt(0)));
            if (word.length() > 1) {
                sb.append(word.substring(1).toLowerCase());
            }
        }

        return sb.toString();
    }
}