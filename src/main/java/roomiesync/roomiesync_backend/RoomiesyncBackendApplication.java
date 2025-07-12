package roomiesync.roomiesync_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RoomiesyncBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(RoomiesyncBackendApplication.class, args);
  }

}
