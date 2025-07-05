package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import roomiesync.roomiesync_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
