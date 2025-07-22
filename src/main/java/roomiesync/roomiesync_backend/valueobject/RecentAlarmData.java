package roomiesync.roomiesync_backend.valueobject;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class RecentAlarmData {
  @NonNull
  private final String name;

  @NonNull
  private final LocalTime time;

  @NonNull
  private final LocalDateTime cachedAt;
}
