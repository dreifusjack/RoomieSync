package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import roomiesync.roomiesync_backend.entity.ChoreAssignment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChoreAssignmentRepository extends JpaRepository<ChoreAssignment, UUID> {
  List<ChoreAssignment> findByChoreId(UUID choreId);

  Optional<ChoreAssignment> findByChoreIdAndUserId(UUID choreId, UUID userId);
}
