package roomiesync.roomiesync_backend.mapper;

import roomiesync.roomiesync_backend.dto.ChoreAssignmentDto;
import roomiesync.roomiesync_backend.entity.ChoreAssignment;

public class ChoreAssignmentMapper {
  public static ChoreAssignmentDto mapToChoreAssignmentDto(ChoreAssignment choreAssignment) {
    return ChoreAssignmentDto.builder()
            .choreId(choreAssignment.getChore().getId())
            .userId(choreAssignment.getUser().getId())
            .dueDate(choreAssignment.getDueDate())
            .build();
  }

  public static ChoreAssignmentDto mapToChoreAssignmentDtoWithUser(ChoreAssignment choreAssignment) {
    return ChoreAssignmentDto.builder()
            .choreId(choreAssignment.getChore().getId())
            .userId(choreAssignment.getUser().getId())
            .dueDate(choreAssignment.getDueDate())
            .user(UserMapper.mapToUserDto(choreAssignment.getUser()))
            .build();
  }

  public static ChoreAssignment mapToChoreAssignment(ChoreAssignmentDto choreAssignmentDto) {
    return ChoreAssignment.builder()
            .dueDate(choreAssignmentDto.getDueDate())
            .build();
  }
}
