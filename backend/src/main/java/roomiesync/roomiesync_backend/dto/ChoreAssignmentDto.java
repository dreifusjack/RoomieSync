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
public class ChoreAssignmentDto {
  private UUID choreId;
  private UUID userId;
  private LocalDateTime dueDate;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private UserDto user;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private ChoreDto chore;
}
