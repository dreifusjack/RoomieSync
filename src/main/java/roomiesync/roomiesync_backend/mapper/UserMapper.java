package roomiesync.roomiesync_backend.mapper;

import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.entity.User;

public class UserMapper {
  public static UserDto mapToUserDto(User user) {
    return new UserDto(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPassword()
    );
  }

  public static User mapToUser(UserDto userDto) {
    return new User(
            userDto.getId(),
            userDto.getFirstName(),
            userDto.getLastName(),
            userDto.getEmail(),
            userDto.getPassword()
    );
  }
}
