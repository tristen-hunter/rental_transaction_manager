package com.propcoza.legends.tools.rental_transaction_manager.repo;

import com.propcoza.legends.tools.rental_transaction_manager.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NoteRepo extends JpaRepository<Note, UUID> {
}
