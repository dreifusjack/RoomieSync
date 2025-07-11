package roomiesync.roomiesync_backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmDto {
  private UUID id;
  private UUID userId;
  private String name;
  private LocalDateTime time;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private UserDto user;
}
