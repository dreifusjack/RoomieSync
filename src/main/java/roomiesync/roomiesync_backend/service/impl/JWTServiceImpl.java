package roomiesync.roomiesync_backend.service.impl;

import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.service.JWTService;

@Service
@AllArgsConstructor
public class JWTServiceImpl implements JWTService {

  @Override
  public String generateToken(String email) {
    Map<String, Object> claims = new HashMap<>();

    return Jwts.builder()
            .claims()
            .add(claims)
            .subject(email)
            .issuedAt(Date.from(Instant.now()))
            .expiration(Date.from(Instant.now().plus(Duration.ofHours(12))))
            .and()
            .signWith(generateKey())
            .compact();
  }
  
  private SecretKey generateKey() {
    try {
      KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
      return keyGen.generateKey();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(e);
    }
  }
}
