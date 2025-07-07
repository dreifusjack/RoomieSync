package roomiesync.roomiesync_backend.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.entity.User;
import roomiesync.roomiesync_backend.mapper.UserMapper;
import roomiesync.roomiesync_backend.repository.UserRepository;
import roomiesync.roomiesync_backend.service.AuthService;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
  private UserRepository userRepository;
  private BCryptPasswordEncoder passwordEncoder;
  private AuthenticationManager authManager;

  @Override
  public UserDto registerUser(UserDto userDto) {
    User user = UserMapper.mapToUser(userDto);
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    User savedUser = userRepository.save(user);
    return UserMapper.mapToUserDto(savedUser);
  }

  @Override
  public String verifyUser(UserDto userDto) {
    User user = UserMapper.mapToUser(userDto);
    Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

    if (!authentication.isAuthenticated()) {
      throw new BadCredentialsException("Invalid username or password");
    }

    return "success";
  }
}
