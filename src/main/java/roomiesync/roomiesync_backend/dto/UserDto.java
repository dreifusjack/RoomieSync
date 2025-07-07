package roomiesync.roomiesync_backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
  private UUID id;
  private String email;
  private String firstName;
  private String lastName;

  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  // Auth fields
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String token;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String tokenType;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private Long expiresIn;
}
