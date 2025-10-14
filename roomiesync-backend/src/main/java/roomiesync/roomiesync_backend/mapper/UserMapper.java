package roomiesync.roomiesync_backend.mapper;

import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.entity.User;

public class UserMapper {
  public static UserDto mapToUserDto(User user) {
    // excludes password
    return UserDto.builder()
        .id(user.getId())
        .email(user.getEmail())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .password(user.getPassword())
        .groupId(user.getGroupId())
        .build();
  }

  public static User mapToUser(UserDto userDto) {
    return User.builder()
        .id(userDto.getId())
        .email(userDto.getEmail())
        .firstName(userDto.getFirstName())
        .lastName(userDto.getLastName())
        .password(userDto.getPassword())
        .groupId(userDto.getGroupId())
        .build();
  }
}