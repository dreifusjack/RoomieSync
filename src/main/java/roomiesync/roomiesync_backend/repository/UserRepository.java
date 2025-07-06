package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import roomiesync.roomiesync_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
