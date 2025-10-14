package roomiesync.roomiesync_backend.mapper;

import roomiesync.roomiesync_backend.dto.AlarmDto;
import roomiesync.roomiesync_backend.entity.Alarm;

public class AlarmMapper {
  public static AlarmDto mapToAlarmDto(Alarm alarm) {
    return AlarmDto.builder()
            .id(alarm.getId())
            .userId(alarm.getUser().getId())
            .name(alarm.getName())
            .time(alarm.getTime())
            .consecutiveDays(alarm.getConsecutiveDays())
            .expirationDate(alarm.getExpirationDate())
            .build();
  }

  public static AlarmDto mapToAlarmDtoWithUser(Alarm alarm) {
    return AlarmDto.builder()
            .id(alarm.getId())
            .userId(alarm.getUser().getId())
            .name(alarm.getName())
            .time(alarm.getTime())
            .consecutiveDays(alarm.getConsecutiveDays())
            .expirationDate(alarm.getExpirationDate())
            .user(UserMapper.mapToUserDto(alarm.getUser()))
            .build();
  }

  public static Alarm mapToAlarm(AlarmDto alarmDto) {
    return Alarm.builder()
            .id(alarmDto.getId())
            .name(alarmDto.getName())
            .time(alarmDto.getTime())
            .consecutiveDays(alarmDto.getConsecutiveDays())
            .expirationDate(alarmDto.getExpirationDate())
            .build();
  }
}