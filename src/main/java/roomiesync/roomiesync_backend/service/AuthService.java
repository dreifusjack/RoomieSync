package roomiesync.roomiesync_backend.service;

import roomiesync.roomiesync_backend.dto.UserDto;

public interface AuthService {
  UserDto registerUser(UserDto userDto);

  UserDto verifyUser(UserDto userDto);
}
