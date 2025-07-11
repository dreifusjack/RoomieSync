package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.transaction.Transactional;
import roomiesync.roomiesync_backend.entity.ChoreAssignment;

public interface ChoreAssignmentRepository extends JpaRepository<ChoreAssignment, UUID> {
  List<ChoreAssignment> findByChoreId(UUID choreId);

  @Modifying
  @Transactional
  @Query("DELETE FROM ChoreAssignment ca WHERE ca.dueDate < :now")
  void deleteExpiredAssignments(LocalDateTime now);
}
