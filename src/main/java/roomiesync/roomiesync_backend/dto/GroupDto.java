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
public class GroupDto {
  private UUID id;
  private String name;
  private String groupCode;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<UserDto> users;
}
