package roomiesync.roomiesync_backend.service.impl;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.GroupDto;
import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.entity.Group;
import roomiesync.roomiesync_backend.entity.User;
import roomiesync.roomiesync_backend.exception.ResourceNotFoundException;
import roomiesync.roomiesync_backend.mapper.GroupMapper;
import roomiesync.roomiesync_backend.mapper.UserMapper;
import roomiesync.roomiesync_backend.repository.GroupRepository;
import roomiesync.roomiesync_backend.repository.UserRepository;
import roomiesync.roomiesync_backend.service.AuthService;
import roomiesync.roomiesync_backend.service.GroupService;

@Service
@AllArgsConstructor
public class GroupServiceImpl implements GroupService {
  private GroupRepository groupRepository;
  private UserRepository userRepository;
  private AuthService authService;

  @Override
  public GroupDto createGroup(String name) {
    User user = authService.getCurrentUserEntity();
    isAlreadyInGroup(user);

    // Generate unique group code
    String groupCode = generateGroupCode();
    while (groupRepository.findByGroupCode(groupCode).isPresent()) {
      groupCode = generateGroupCode();
    }

    Group group = Group.builder()
            .name(name)
            .groupCode(groupCode)
            .build();
    Group savedGroup = groupRepository.save(group);

    user.setGroupId(savedGroup.getId());
    userRepository.save(user);

    return GroupMapper.mapToGroupDto(savedGroup);
  }


  @Override
  public GroupDto joinGroup(String groupCode) {
    User user = authService.getCurrentUserEntity();
    isAlreadyInGroup(user);

    Group group = groupRepository.findByGroupCode(groupCode)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found with code: " + groupCode));

    user.setGroupId(group.getId());
    userRepository.save(user);

    return GroupMapper.mapToGroupDto(group);
  }

  private static void isAlreadyInGroup(User user) {
    if (user.getGroupId() != null) {
      throw new RuntimeException("User already has a group");
    }
  }

  @Override
  public List<GroupDto> getAllGroups() {
    return groupRepository.findAll().stream()
            .map(GroupMapper::mapToGroupDto)
            .collect(Collectors.toList());
  }

  @Override
  public List<UserDto> getUsersInGroup(UUID groupId) {
    return userRepository.findByGroupId(groupId).stream()
            .map(UserMapper::mapToUserDto)
            .collect(Collectors.toList());
  }

  @Override
  public GroupDto getGroup(UUID groupId) {
    Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
    return GroupMapper.mapToGroupDto(group);
  }

  private String generateGroupCode() {
    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    Random rnd = new Random();
    StringBuilder sb = new StringBuilder(10);
    for (int i = 0; i < 10; i++) {
      sb.append(chars.charAt(rnd.nextInt(chars.length())));
    }
    return sb.toString();
  }
}
