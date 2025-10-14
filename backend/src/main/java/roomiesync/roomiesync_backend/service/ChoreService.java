package roomiesync.roomiesync_backend.service;

import java.util.List;
import java.util.UUID;

import roomiesync.roomiesync_backend.dto.ChoreAssignmentDto;
import roomiesync.roomiesync_backend.dto.ChoreDto;

public interface ChoreService {
  ChoreDto createChore(ChoreDto choreDto);

  ChoreAssignmentDto assignChore(UUID choreId, ChoreAssignmentDto choreAssignmentDto);

  List<ChoreDto> getChores();

  List<ChoreAssignmentDto> getAssignments(UUID choreId);

  void deleteChore(UUID choreId);

  void sendReminder(UUID choreId);

  @SuppressWarnings("unused")
  void cleanupExpiredAssignments();
}
