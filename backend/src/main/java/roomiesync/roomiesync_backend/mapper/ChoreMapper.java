package roomiesync.roomiesync_backend.mapper;

import java.util.stream.Collectors;

import roomiesync.roomiesync_backend.dto.ChoreDto;
import roomiesync.roomiesync_backend.entity.Chore;

public class ChoreMapper {
  public static ChoreDto mapToChoreDto(Chore chore) {
    return ChoreDto.builder()
            .id(chore.getId())
            .groupId(chore.getGroup().getId())
            .name(chore.getName())
            .description(chore.getDescription())
            .cadence(chore.getCadence())
            .build();
  }

  public static ChoreDto mapToChoreDtoWithAssignments(Chore chore) {
    return ChoreDto.builder()
            .id(chore.getId())
            .groupId(chore.getGroup().getId())
            .name(chore.getName())
            .description(chore.getDescription())
            .cadence(chore.getCadence())
            .assignments(chore.getAssignments() != null ? chore.getAssignments().stream()
                    .map(ChoreAssignmentMapper::mapToChoreAssignmentDto)
                    .collect(Collectors.toList()) : null)
            .build();
  }

  public static Chore mapToChore(ChoreDto choreDto) {
    return Chore.builder()
            .id(choreDto.getId())
            .name(choreDto.getName())
            .description(choreDto.getDescription())
            .cadence(choreDto.getCadence())
            .build();
  }
}
