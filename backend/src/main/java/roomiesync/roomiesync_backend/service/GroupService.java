package roomiesync.roomiesync_backend.service;

import roomiesync.roomiesync_backend.dto.GroupDto;
import roomiesync.roomiesync_backend.dto.UserDto;

import java.util.List;
import java.util.UUID;

public interface GroupService {
  GroupDto createGroup(String name);

  GroupDto joinGroup(String groupCode);

  List<GroupDto> getAllGroups();

  List<UserDto> getUsersInGroup(UUID groupId);

  GroupDto getGroup(UUID groupId);
}
