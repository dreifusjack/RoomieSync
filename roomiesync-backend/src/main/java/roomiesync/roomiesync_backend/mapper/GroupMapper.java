package roomiesync.roomiesync_backend.mapper;

import roomiesync.roomiesync_backend.dto.GroupDto;
import roomiesync.roomiesync_backend.entity.Group;

public class GroupMapper {
  public static GroupDto mapToGroupDto(Group group) {
    return GroupDto.builder()
            .id(group.getId())
            .name(group.getName())
            .groupCode(group.getGroupCode())
            .build();
  }

  public static Group mapToGroup(GroupDto groupDto) {
    return Group.builder()
            .id(groupDto.getId())
            .name(groupDto.getName())
            .groupCode(groupDto.getGroupCode())
            .build();
  }
}
