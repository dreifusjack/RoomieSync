package roomiesync.roomiesync_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.service.AuthService;

@AllArgsConstructor
@RestController
@RequestMapping("api/auth")
public class AuthController {
  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
    UserDto registeredUser = authService.registerUser(userDto);
    return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
  }

  @PostMapping("/login")
  public ResponseEntity<UserDto> loginUser(@RequestBody UserDto userDto) {
    UserDto authenticatedUser = authService.verifyUser(userDto);
    return ResponseEntity.ok(authenticatedUser);
  }

  @GetMapping("/user")
  public ResponseEntity<UserDto> currentUser() {
    UserDto currentUser = authService.getCurrentUser();
    return ResponseEntity.ok(currentUser);
  }
}
