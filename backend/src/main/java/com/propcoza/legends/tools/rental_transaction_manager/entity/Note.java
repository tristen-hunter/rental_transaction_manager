package com.propcoza.legends.tools.rental_transaction_manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "notes", indexes = {
        @Index(name = "idx_note_rental_instance", columnList = "rental_instance_id")
})
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_instance_id", nullable = false)
    private RentalInstance rentalInstance;

    @NotBlank // Ensures the note isn't empty in the application layer
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Note note)) return false;
        return id != null && id.equals(note.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}