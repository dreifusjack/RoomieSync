package roomiesync.roomiesync_backend.valueobject;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class RecentAlarmData {
  @NonNull
  private final String name;

  @NonNull
  private final LocalDateTime time;

  @NonNull
  private final LocalDateTime cachedAt;
}
