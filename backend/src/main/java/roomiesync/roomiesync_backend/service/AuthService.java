package roomiesync.roomiesync_backend.service;

import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.entity.User;

public interface AuthService {
  UserDto registerUser(UserDto userDto);

  UserDto verifyUser(UserDto userDto);

  UserDto getCurrentUser();

  User getCurrentUserEntity();
}
