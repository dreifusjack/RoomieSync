package roomiesync.roomiesync_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.service.UserService;

@AllArgsConstructor
@RestController
@RequestMapping("api/users")
public class UserController {
  private UserService userService;

  @GetMapping("{userId}")
  public ResponseEntity<UserDto> getUserById(@PathVariable UUID userId) {
    UserDto userDto = userService.getUserById(userId);
    return ResponseEntity.ok(userDto);
  }

  @GetMapping
  public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> userDtos = userService.getAllUsers();
    return ResponseEntity.ok(userDtos);
  }

  @DeleteMapping("{userId}")
  public ResponseEntity<String> deleteUser(@PathVariable UUID userId) {
    userService.deleteUserById(userId);
    return ResponseEntity.ok("User successfully deleted");
  }
}
