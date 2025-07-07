package roomiesync.roomiesync_backend.service.impl;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.service.JWTService;

@Service
@AllArgsConstructor
public class JWTServiceImpl implements JWTService {
  @Override
  public String generateToken() {
    return "";
  }
}
