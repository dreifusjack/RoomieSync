package roomiesync.roomiesync_backend.service.impl;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.entity.User;
import roomiesync.roomiesync_backend.exception.ResourceNotFoundException;
import roomiesync.roomiesync_backend.mapper.UserMapper;
import roomiesync.roomiesync_backend.repository.UserRepository;
import roomiesync.roomiesync_backend.service.AuthService;
import roomiesync.roomiesync_backend.service.UserService;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
  private UserRepository userRepository;
  private AuthService authService;

  @Override
  public UserDto getUserById(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
    return UserMapper.mapToUserDto(user);
  }

  @Override
  public List<UserDto> getAllGroupUsers() {
    UserDto currentUser = authService.getCurrentUser();
    return userRepository.findByGroupId(currentUser.getGroupId()).stream().map(UserMapper::mapToUserDto).toList();
  }

  @Override
  public void deleteUserById(UUID id) {
    userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
    userRepository.deleteById(id);
  }
}
