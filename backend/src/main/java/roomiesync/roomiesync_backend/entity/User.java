package roomiesync.roomiesync_backend.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import roomiesync.roomiesync_backend.valueobject.RecentAlarmData;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "first_name", nullable = false)
  private String firstName;

  @Column(name = "last_name", nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(name = "group_id")
  private UUID groupId;

  @Column(name = "recent_alarms", columnDefinition = "JSON")
  @JdbcTypeCode(SqlTypes.JSON)
  @Builder.Default
  private List<RecentAlarmData> recentAlarms = new ArrayList<>();

  private static final int MAX_RECENT_ALARMS = 3;

  public void addRecentAlarm(Alarm alarm) {
    try {
      RecentAlarmData recentAlarm = RecentAlarmData.builder()
          .name(alarm.getName())
          .time(alarm.getTime())
          .cachedAt(LocalDateTime.now())
          .build();

      if (recentAlarms.size() >= MAX_RECENT_ALARMS) {
        recentAlarms.remove(recentAlarms.size() - 1);
      }
      recentAlarms.add(0, recentAlarm);

    } catch (Exception e) {
      throw new RuntimeException("failed to add recent alarm", e);
    }
  }
}
