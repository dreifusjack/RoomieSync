package roomiesync.roomiesync_backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alarms")
public class Alarm {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false)
  private LocalDateTime time;

  @Column(name = "consecutive_days")
  private Integer consecutiveDays;

  @Column(name = "expiration_date")
  private LocalDateTime expirationDate;

  @PrePersist
  protected void onCreate() {
    if (isConsecutive() && consecutiveDays <= 0) {
      throw new IllegalArgumentException("Consecutive days must be positive");
    }

    if (expirationDate == null) {
      expirationDate = (isConsecutive()) ?
              LocalDateTime.now().plusDays(consecutiveDays) :
              LocalDateTime.now().plusDays(1);
    }
  }

  private boolean isConsecutive() {
    return consecutiveDays != null;
  }
}
