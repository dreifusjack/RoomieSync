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
import roomiesync.roomiesync_backend.dto.ChoreAssignmentDto;
import roomiesync.roomiesync_backend.dto.ChoreDto;
import roomiesync.roomiesync_backend.service.ChoreService;

@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class ChoreController {

  private ChoreService choreService;

  @PostMapping("/groups/{groupId}/chores")
  public ResponseEntity<ChoreDto> createChore(
          @PathVariable UUID groupId, @RequestBody ChoreDto choreDto) {
    ChoreDto createdChore = choreService.createChore(groupId, choreDto);
    return new ResponseEntity<>(createdChore, HttpStatus.CREATED);
  }

  @PostMapping("/chores/{choreId}/assignments")
  public ResponseEntity<ChoreAssignmentDto> assignChore(
          @PathVariable UUID choreId, @RequestBody ChoreAssignmentDto choreAssignmentDto) {
    ChoreAssignmentDto assigned = choreService.assignChore(choreId, choreAssignmentDto);
    return ResponseEntity.ok(assigned);
  }

  @GetMapping("/groups/{groupId}/chores")
  public ResponseEntity<List<ChoreDto>> getChores(@PathVariable UUID groupId) {
    return ResponseEntity.ok(choreService.getChores(groupId));
  }

  @GetMapping("/chores/{choreId}/assignments")
  public ResponseEntity<List<ChoreAssignmentDto>> getAssignments(@PathVariable UUID choreId) {
    return ResponseEntity.ok(choreService.getAssignments(choreId));
  }

  @DeleteMapping("/chores/{choreId}")
  public ResponseEntity<String> deleteChore(@PathVariable UUID choreId) {
    choreService.deleteChore(choreId);
    return ResponseEntity.ok("Chore successfully deleted");
  }
}
