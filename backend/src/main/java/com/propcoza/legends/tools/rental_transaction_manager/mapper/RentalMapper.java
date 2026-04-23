package com.propcoza.legends.tools.rental_transaction_manager.mapper;

import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.RentalReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Agent;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Rental;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalStatus;
import org.jetbrains.annotations.Contract;
import org.jspecify.annotations.NonNull;

import java.util.List;

/**
 * Mapper for converting between Rental entity and its DTOs.
 *
 * NOTE: toEntity() requires a resolved Agent object — the caller
 * (typically the service layer) is responsible for fetching it
 * from the repository before invoking this mapper.
 */
public class RentalMapper {

    // -------------------------------------------------------
    //   RentalCreateDto  →  Rental entity
    // -------------------------------------------------------

    /**
     * Maps a {@link RentalCreateDto} and a resolved {@link Agent} to a new {@link Rental} entity.
     *
     * <p>Fields derived or defaulted by this mapper:
     * <ul>
     *   <li>{@code startDate}  — set to {@code dto.paymentDate()} (first payment = contract start)</li>
     *   <li>{@code agentSplit} — derived as {@code 1.0 - dto.officeSplit()} so splits always sum to 100%</li>
     *   <li>{@code status}     — defaults to {@link RentalStatus#ACTIVE}</li>
     * </ul>
     *
     * @param dto   the creation DTO containing all client-supplied fields
     * @param agent the fully resolved Agent entity (must not be null)
     * @return a populated, transient {@link Rental} ready to be persisted
     */
    public static @NonNull Rental toEntity(@NonNull RentalCreateDto dto, Agent agent) {
        Rental rental = new Rental();

        // Relationship
        rental.setAgent(agent);

        // Meta data
        rental.setAddress(dto.address());
        rental.setTenantName(dto.tenantName());
        rental.setPaymentDate(dto.paymentDate());

        // Recurring rental fields
        rental.setStartDate(dto.paymentDate()); // first payment date doubles as contract start
        rental.setEndDate(dto.endDate());       // null if open-ended / auto-renew
        rental.setAutoRenew(dto.autoRenew());
        rental.setStatus(RentalStatus.ACTIVE);  // always ACTIVE on creation

        // Landlord info
        rental.setLandlordName(dto.landlordName());
        rental.setLandlordBankName(dto.landlordBankName());
        rental.setLandlordAccNo(dto.landlordAccNo());
        rental.setLandlordBranch(dto.landlordBranch());

        // Commission — agentSplit is derived to guarantee splits sum to 1.0
        rental.setRentalCommissionPercent(dto.rentalCommissionPercent());
        rental.setOfficeSplit(dto.officeSplit());
        rental.setAgentSplit(1.0 - dto.officeSplit());
        rental.setAgentPaye(dto.agentPaye());
        rental.setVatRegistered(dto.vatRegistered());

        // Audit
        rental.setCreatedBy(dto.createdBy());

        return rental;
    }

    // -------------------------------------------------------
    //   Rental entity  →  RentalReturnDto
    // -------------------------------------------------------

    /**
     * Maps a {@link Rental} entity to a {@link RentalReturnDto}.
     *
     * <p>{@code agentName} is resolved from the associated {@link Agent} — ensure
     * the agent relationship is initialised before calling this method to
     * avoid a {@code LazyInitializationException}.
     *
     * @param rental the entity to map (agent must be initialised)
     * @return a fully populated {@link RentalReturnDto}
     */
    public static @NonNull RentalReturnDto toReturnDto(Rental rental) {
        Agent agent = rental.getAgent();

        return new RentalReturnDto(
                // Identity
                rental.getId(),

                // Agent summary (flattened — avoids exposing full Agent entity)
                agent.getId(),
                agent.getFullName(),

                // Meta data
                rental.getAddress(),
                rental.getTenantName(),
                rental.getPaymentDate(),

                // Recurring rental fields
                rental.getStartDate(),
                rental.getEndDate(),
                rental.getAutoRenew(),
                rental.getStatus(),

                // Landlord info
                rental.getLandlordName(),
                rental.getLandlordBankName(),
                rental.getLandlordAccNo(),
                rental.getLandlordBranch(),

                // Commission
                rental.getRentalCommissionPercent(),
                rental.getOfficeSplit(),
                rental.getAgentSplit(),
                rental.getAgentPaye(),
                rental.getVatRegistered(),

                // Audit
                rental.getCreatedBy(),
                rental.getCreatedAt(),
                rental.getUpdatedAt()
        );
    }

    // -------------------------------------------------------
    //   List<Rental>  →  List<RentalReturnDto>
    // -------------------------------------------------------

    /**
     * Convenience method to transpose a list of {@link Rental} entities
     * to a list of {@link RentalReturnDto}s.
     *
     * @param rentals list of entities (agent must be initialised on each)
     * @return list of return DTOs in the same order
     */
    public static List<RentalReturnDto> toReturnDtoList(@NonNull List<Rental> rentals) {
        return rentals.stream()
                .map(RentalMapper::toReturnDto)
                .toList();
    }

    // Prevent instantiation — all methods are static
    private RentalMapper() {}
}