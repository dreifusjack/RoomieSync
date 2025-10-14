package roomiesync.roomiesync_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.AlarmDto;
import roomiesync.roomiesync_backend.service.AlarmService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/alarms")
public class AlarmController {
  private AlarmService alarmService;

  @PostMapping
  public ResponseEntity<AlarmDto> createAlarm(@RequestBody AlarmDto alarmDto) {
    AlarmDto createdAlarm = alarmService.createAlarm(alarmDto);
    return new ResponseEntity<>(createdAlarm, HttpStatus.CREATED);
  }

  @GetMapping("/group/{groupId}")
  public ResponseEntity<List<AlarmDto>> getGroupAlarms(@PathVariable UUID groupId) {
    return ResponseEntity.ok(alarmService.getGroupAlarms(groupId));
  }

  @GetMapping
  public ResponseEntity<List<AlarmDto>> getUserAlarms() {
    return ResponseEntity.ok(alarmService.getUserAlarms());
  }

  @DeleteMapping("/{alarmId}")
  public ResponseEntity<String> deleteAlarm(@PathVariable UUID alarmId) {
    alarmService.deleteAlarm(alarmId);
    return ResponseEntity.ok("Alarm successfully deleted");
  }
}
