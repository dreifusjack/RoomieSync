package roomiesync.roomiesync_backend.mapper;

import java.util.stream.Collectors;

import roomiesync.roomiesync_backend.dto.GroupDto;
import roomiesync.roomiesync_backend.entity.Group;

public class GroupMapper {
  public static GroupDto mapToGroupDto(Group group) {
    return GroupDto.builder()
            .id(group.getId())
            .name(group.getName())
            .groupCode(group.getGroupCode())
            .users(group.getUsers() != null ? group.getUsers().stream()
                    .map(UserMapper::mapToUserDto)
                    .collect(Collectors.toList()) : null)
            .build();
  }

  public static GroupDto mapToGroupDtoWithoutUsers(Group group) {
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
