package roomiesync.roomiesync_backend.service;

import java.util.List;
import java.util.UUID;

import roomiesync.roomiesync_backend.dto.AlarmDto;

public interface AlarmService {
  AlarmDto createAlarm(AlarmDto alarmDto);

  List<AlarmDto> getGroupAlarms(UUID groupId);

  List<AlarmDto> getUserAlarms();

  void deleteAlarm(UUID alarmId);

  @SuppressWarnings("unused")
  void cleanupExpiredAlarms();
}
