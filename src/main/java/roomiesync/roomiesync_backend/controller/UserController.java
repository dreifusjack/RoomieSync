package roomiesync.roomiesync_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @PostMapping("/register")
  public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
    UserDto registeredUser = userService.registerUser(userDto);
    return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
  }

  @GetMapping("{id}")
  public ResponseEntity<UserDto> getUserById(@PathVariable("id") UUID userId) {
    UserDto userDto = userService.getUserById(userId);
    return new ResponseEntity<>(userDto, HttpStatus.OK);
  }

  @GetMapping
  public ResponseEntity<List<UserDto>> getAllUsers() {
    List<UserDto> userDtos = userService.getAllUsers();
    return new ResponseEntity<>(userDtos, HttpStatus.OK);
  }

  @DeleteMapping("{id}")
  public ResponseEntity<String> deleteUser(@PathVariable("id") UUID userId) {
    userService.deleteUserById(userId);
    return new ResponseEntity<>("User successfully deleted", HttpStatus.OK);
  }
}
