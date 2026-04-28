package com.propcoza.legends.tools.rental_transaction_manager.mapper;

import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceCreateDto;
import com.propcoza.legends.tools.rental_transaction_manager.dto.InstanceReturnDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Adjustment;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Note;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class InstanceMapper {

    private final AdjustmentMapper adjMapper;
    private final NoteMapper noteMapper;

    public @NonNull RentalInstance toEntity(@NonNull InstanceCreateDto dto) {
        RentalInstance instance = new RentalInstance();

        // Note: rental must be resolved and set by the service layer via rentalId
        instance.setBillingPeriod(dto.getBillingPeriod());
        instance.setActualPaymentDate(dto.getActualPaymentDate());
        instance.setStatus(dto.getStatus());

        instance.setRentalCommissionPercent(dto.getRentalCommissionPercent());
        instance.setOfficeSplit(dto.getOfficeSplit());
        instance.setAgentSplit(dto.getAgentSplit());
        instance.setAgentPaye(dto.getAgentPaye());

        instance.setBaseRent(dto.getBaseRent());
        instance.setTotalAmountPaid(dto.getTotalAmountPaid());
        instance.setLandlordPayAmount(dto.getLandlordPayAmount());
        instance.setBaseComm(dto.getBaseComm());
        instance.setVat(dto.getVat());
        instance.setCommExclVat(dto.getCommExclVat());
        instance.setCompanyComm(dto.getCompanyComm());
        instance.setAgentGrossComm(dto.getAgentGrossComm());
        instance.setPayeAmount(dto.getPayeAmount());
        instance.setAgentNettComm(dto.getAgentNettComm());

        instance.setLeaseFee(dto.getLeaseFee());
        instance.setLeaseFeeAgentPortion(dto.getLeaseFeeAgentPortion());
        instance.setLeaseFeeOfficePortion(dto.getLeaseFeeOfficePortion());

        instance.setDeposit(dto.getDeposit());

        if (dto.getAdjustments() != null) {
            dto.getAdjustments().forEach(adjDto -> {
                Adjustment adj = adjMapper.toEntity(adjDto);
                instance.addAdjustment(adj);
            });
        }

        if (dto.getNotes() != null) {
            dto.getNotes().forEach(noteDto -> {
                Note note = noteMapper.toEntity(noteDto);
                instance.addNote(note);
            });
        }

        return instance;
    }

    public static @NonNull InstanceReturnDto toReturnDto(@NonNull RentalInstance instance) {
        InstanceReturnDto dto = new InstanceReturnDto();

        dto.setId(instance.getId());
        dto.setRentalId(instance.getRental().getId());
        dto.setBillingPeriod(instance.getBillingPeriod());
        dto.setActualPaymentDate(instance.getActualPaymentDate());

        dto.setRentalCommissionPercent(instance.getRentalCommissionPercent());
        dto.setOfficeSplit(instance.getOfficeSplit());
        dto.setAgentSplit(instance.getAgentSplit());
        dto.setAgentPaye(instance.getAgentPaye());

        dto.setBaseRent(instance.getBaseRent());
        dto.setTotalAmountPaid(instance.getTotalAmountPaid());
        dto.setLandlordPayAmount(instance.getLandlordPayAmount());
        dto.setBaseComm(instance.getBaseComm());
        dto.setVat(instance.getVat());
        dto.setCommExclVat(instance.getCommExclVat());
        dto.setCompanyComm(instance.getCompanyComm());
        dto.setAgentGrossComm(instance.getAgentGrossComm());
        dto.setPayeAmount(instance.getPayeAmount());
        dto.setAgentNettComm(instance.getAgentNettComm());

        dto.setLeaseFee(instance.getLeaseFee());
        dto.setLeaseFeeAgentPortion(instance.getLeaseFeeAgentPortion());
        dto.setLeaseFeeOfficePortion(instance.getLeaseFeeOfficePortion());

        dto.setDeposit(instance.getDeposit());

        dto.setStatus(instance.getStatus());
        dto.setCreatedAt(instance.getCreatedAt());
        dto.setUpdatedAt(instance.getUpdatedAt());

        return dto;
    }

    public static @NonNull List<InstanceReturnDto> toReturnDtoList(@NonNull List<RentalInstance> instances) {
        return instances.stream()
                .map(InstanceMapper::toReturnDto)
                .toList();
    }
}