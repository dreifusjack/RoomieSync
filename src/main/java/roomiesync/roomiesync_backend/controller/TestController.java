package roomiesync.roomiesync_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// to be removed
@RestController
public class TestController {

  @GetMapping("/")
  public String index() {
    return "Hello World";
  }
}
