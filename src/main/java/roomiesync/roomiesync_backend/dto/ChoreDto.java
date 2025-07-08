package roomiesync.roomiesync_backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChoreDto {
  private UUID id;
  private UUID groupId;
  private String name;
  private String description;
  private String cadence;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<ChoreAssignmentDto> assignments;
}
