package roomiesync.roomiesync_backend.service;

public interface JWTService {
  String generateToken(String email);
}
