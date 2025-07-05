package roomiesync.roomiesync_backend.service;

import java.util.List;

import roomiesync.roomiesync_backend.dto.UserDto;

public interface UserService {
  UserDto createUser(UserDto userDto);

  UserDto getUserById(Long id);

  List<UserDto> getAllUsers();

  void deleteUserById(Long id);
}
