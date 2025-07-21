package roomiesync.roomiesync_backend.service.impl;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.AlarmDto;
import roomiesync.roomiesync_backend.entity.Alarm;
import roomiesync.roomiesync_backend.entity.User;
import roomiesync.roomiesync_backend.exception.ResourceNotFoundException;
import roomiesync.roomiesync_backend.mapper.AlarmMapper;
import roomiesync.roomiesync_backend.repository.AlarmRepository;
import roomiesync.roomiesync_backend.repository.UserRepository;
import roomiesync.roomiesync_backend.service.AlarmService;
import roomiesync.roomiesync_backend.service.AuthService;

@Service
@AllArgsConstructor
public class AlarmServiceImpl implements AlarmService {
  private AlarmRepository alarmRepository;
  private AuthService authService;
  private UserRepository userRepository;

  @Override
  public AlarmDto createAlarm(AlarmDto alarmDto) {
    User user = authService.getCurrentUserEntity();

    Alarm alarm = Alarm.builder()
            .name(alarmDto.getName())
            .time(alarmDto.getTime())
            .consecutiveDays(alarmDto.getConsecutiveDays())
            .expirationDate(alarmDto.getExpirationDate())
            .user(user)
            .build();

    Alarm savedAlarm = alarmRepository.save(alarm);

    user.addRecentAlarm(savedAlarm);
    userRepository.save(user);

    return AlarmMapper.mapToAlarmDto(savedAlarm);
  }

  @Override
  public List<AlarmDto> getGroupAlarms(UUID groupId) {
    List<Alarm> alarms = alarmRepository.findByGroupId(groupId);
    return alarms.stream()
            .map(AlarmMapper::mapToAlarmDtoWithUser)
            .collect(Collectors.toList());
  }

  @Override
  public List<AlarmDto> getUserAlarms() {
    UUID userId = authService.getCurrentUser().getId();
    List<Alarm> alarms = alarmRepository.findByUserId(userId);
    return alarms.stream().map(AlarmMapper::mapToAlarmDto).collect(Collectors.toList());
  }

  @Override
  public void deleteAlarm(UUID alarmId) {
    UUID userId = authService.getCurrentUser().getId();
    Alarm alarm = alarmRepository.findById(alarmId)
            .orElseThrow(() -> new ResourceNotFoundException("Alarm not found with id: " + alarmId));
    if (!alarm.getUser().getId().equals(userId)) {
      throw new ResourceNotFoundException("Not authorized to delete this alarm");
    }
    alarmRepository.delete(alarm);
  }

  @Override
  @Scheduled(fixedRate = 1, timeUnit = TimeUnit.DAYS)
  @Transactional
  public void cleanupExpiredAlarms() {
    try {
      LocalDateTime now = LocalDateTime.now();
      alarmRepository.deleteExpiredAlarms(now);
    } catch (Exception e) {
      throw new RuntimeException("Failed to delete expired alarms", e);
    }
  }
}