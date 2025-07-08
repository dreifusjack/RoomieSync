package roomiesync.roomiesync_backend.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Composite PK for ChoreAssignment Entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChoreAssignmentId implements Serializable {
  private UUID chore;
  private UUID user;

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    ChoreAssignmentId that = (ChoreAssignmentId) o;
    return Objects.equals(chore, that.chore) && Objects.equals(user, that.user);
  }

  @Override
  public int hashCode() {
    return Objects.hash(chore, user);
  }
}
