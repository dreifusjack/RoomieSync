package roomiesync.roomiesync_backend.service;

import java.util.List;
import java.util.UUID;

import roomiesync.roomiesync_backend.dto.UserDto;

public interface UserService {
  UserDto registerUser(UserDto userDto);

  UserDto getUserById(UUID id);

  List<UserDto> getAllUsers();

  void deleteUserById(UUID id);
}
