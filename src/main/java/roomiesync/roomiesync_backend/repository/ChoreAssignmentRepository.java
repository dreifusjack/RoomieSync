package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

import roomiesync.roomiesync_backend.entity.ChoreAssignment;

public interface ChoreAssignmentRepository extends JpaRepository<ChoreAssignment, UUID> {
  List<ChoreAssignment> findByChoreId(UUID choreId);
}
