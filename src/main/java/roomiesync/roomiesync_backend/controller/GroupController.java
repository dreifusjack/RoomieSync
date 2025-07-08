package roomiesync.roomiesync_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import roomiesync.roomiesync_backend.dto.GroupDto;
import roomiesync.roomiesync_backend.dto.UserDto;
import roomiesync.roomiesync_backend.dto.requests.JoinGroupReq;
import roomiesync.roomiesync_backend.service.GroupService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/groups")
public class GroupController {

  private GroupService groupService;

  @PostMapping
  public ResponseEntity<GroupDto> createGroup(@RequestBody GroupDto groupDto) {
    GroupDto createdGroup = groupService.createGroup(groupDto.getName());
    return new ResponseEntity<>(createdGroup, HttpStatus.CREATED);
  }

  @PostMapping("/join")
  public ResponseEntity<GroupDto> joinGroup(@RequestBody JoinGroupReq req) {
    GroupDto joinedGroup = groupService.joinGroup(req.getCode());
    return ResponseEntity.ok(joinedGroup);
  }

  @GetMapping
  public ResponseEntity<List<GroupDto>> getAllGroups() {
    return ResponseEntity.ok(groupService.getAllGroups());
  }

  @GetMapping("/{groupId}/users")
  public ResponseEntity<List<UserDto>> getGroupUsers(@PathVariable UUID groupId) {
    return ResponseEntity.ok(groupService.getUsersInGroup(groupId));
  }

  @GetMapping("/{groupId}")
  public ResponseEntity<GroupDto> getGroup(@PathVariable UUID groupId) {
    return ResponseEntity.ok(groupService.getGroup(groupId));
  }
}
