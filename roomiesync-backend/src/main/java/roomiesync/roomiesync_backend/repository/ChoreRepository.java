package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import roomiesync.roomiesync_backend.entity.Chore;

import java.util.List;
import java.util.UUID;

public interface ChoreRepository extends JpaRepository<Chore, UUID> {
  List<Chore> findByGroupId(UUID groupId);
}
