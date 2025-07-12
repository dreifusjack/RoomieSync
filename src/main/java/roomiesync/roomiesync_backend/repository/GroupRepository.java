package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import roomiesync.roomiesync_backend.entity.Group;

import java.util.Optional;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<Group, UUID> {
  Optional<Group> findByGroupCode(String groupCode);
}
