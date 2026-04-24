package com.propcoza.legends.tools.rental_transaction_manager.mapper;

import com.propcoza.legends.tools.rental_transaction_manager.dto.NoteDto;
import com.propcoza.legends.tools.rental_transaction_manager.entity.Note;
import com.propcoza.legends.tools.rental_transaction_manager.entity.RentalInstance;
import com.propcoza.legends.tools.rental_transaction_manager.repo.RentalInstanceRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class NoteMapper {

    private final RentalInstanceRepo rentalInstanceRepo;

    /**
     * Maps DTO to Entity and validates that the RentalInstance exists.
     */
    public Note toEntity(NoteDto dto) {
        if (dto == null) return null;

        // Fetching the actual entity to ensure data integrity
        RentalInstance rentalInstance = rentalInstanceRepo.findById(dto.getRentalInstanceId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "RentalInstance not found with ID: " + dto.getRentalInstanceId()));

        Note note = new Note();
        note.setRentalInstance(rentalInstance);
        note.setContent(dto.getContent());

        return note;
    }

    /**
     * Maps a list of DTOs to Entities.
     */
    public List<Note> toEntityList(List<NoteDto> dtos) {
        if (dtos == null) return null;

        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}