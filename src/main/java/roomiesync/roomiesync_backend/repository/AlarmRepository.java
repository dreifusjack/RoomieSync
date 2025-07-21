package roomiesync.roomiesync_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import roomiesync.roomiesync_backend.entity.Alarm;

public interface AlarmRepository extends JpaRepository<Alarm, UUID> {
  List<Alarm> findByUserId(UUID userId);

  @Query("SELECT a FROM Alarm a WHERE a.user.group.id = :groupId")
  List<Alarm> findByGroupId(@Param("groupId") UUID groupId);
  
  @Transactional
  @Modifying
  @Query("DELETE FROM Alarm a WHERE a.expirationDate < :now")
  void deleteExpiredAlarms(@Param("now") LocalDateTime now);
}
