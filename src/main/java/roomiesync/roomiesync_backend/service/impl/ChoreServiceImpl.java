package roomiesync.roomiesync_backend.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import roomiesync.roomiesync_backend.dto.ChoreAssignmentDto;
import roomiesync.roomiesync_backend.dto.ChoreDto;
import roomiesync.roomiesync_backend.entity.Chore;
import roomiesync.roomiesync_backend.entity.ChoreAssignment;
import roomiesync.roomiesync_backend.entity.Group;
import roomiesync.roomiesync_backend.entity.User;
import roomiesync.roomiesync_backend.exception.ResourceNotFoundException;
import roomiesync.roomiesync_backend.mapper.ChoreAssignmentMapper;
import roomiesync.roomiesync_backend.mapper.ChoreMapper;
import roomiesync.roomiesync_backend.repository.ChoreAssignmentRepository;
import roomiesync.roomiesync_backend.repository.ChoreRepository;
import roomiesync.roomiesync_backend.repository.GroupRepository;
import roomiesync.roomiesync_backend.repository.UserRepository;
import roomiesync.roomiesync_backend.service.ChoreService;

@Service
@RequiredArgsConstructor
public class ChoreServiceImpl implements ChoreService {
  private final ChoreRepository choreRepository;
  private final ChoreAssignmentRepository choreAssignmentRepository;
  private final GroupRepository groupRepository;
  private final UserRepository userRepository;
  private final JavaMailSender mailSender;

  @Value("${spring.mail.username}")
  private String fromEmail;

  @Override
  public ChoreDto createChore(UUID groupId, ChoreDto choreDto) {
    Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));
    Chore chore = Chore.builder()
            .group(group)
            .name(choreDto.getName())
            .description(choreDto.getDescription())
            .cadence(choreDto.getCadence())
            .build();

    Chore savedChore = choreRepository.save(chore);
    return ChoreMapper.mapToChoreDto(savedChore);
  }

  @Override
  public ChoreAssignmentDto assignChore(UUID choreId, ChoreAssignmentDto choreAssignmentDto) {
    Chore chore = choreRepository.findById(choreId)
            .orElseThrow(() -> new ResourceNotFoundException("Chore not found with id: " + choreId));

    UUID userId = choreAssignmentDto.getUserId();
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

    ChoreAssignment choreAssignment = ChoreAssignment.builder()
            .chore(chore)
            .user(user)
            .dueDate(choreAssignmentDto.getDueDate())
            .build();

    ChoreAssignment savedAssignment = choreAssignmentRepository.save(choreAssignment);
    return ChoreAssignmentMapper.mapToChoreAssignmentDto(savedAssignment);
  }

  @Override
  public List<ChoreDto> getChores(UUID groupId) {
    return choreRepository.findByGroupId(groupId).stream()
            .map(ChoreMapper::mapToChoreDto)
            .collect(Collectors.toList());
  }

  @Override
  public List<ChoreAssignmentDto> getAssignments(UUID choreId) {
    return choreAssignmentRepository.findByChoreId(choreId).stream()
            .map(ChoreAssignmentMapper::mapToChoreAssignmentDto)
            .collect(Collectors.toList());
  }

  @Override
  public void deleteChore(UUID choreId) {
    Chore chore = choreRepository.findById(choreId)
            .orElseThrow(() -> new ResourceNotFoundException("Chore not found with id: " + choreId));
    choreRepository.delete(chore);
  }

  @Override
  public void sendReminder(UUID choreId) {
    Chore chore = choreRepository.findById(choreId)
            .orElseThrow(() -> new ResourceNotFoundException("Chore not found with id: " + choreId));

    List<ChoreAssignment> assignments = chore.getAssignments();
    if (assignments.isEmpty()) {
      throw new RuntimeException("This chore has no assignments");
    }

    List<String> recipients = new ArrayList<>();
    for (ChoreAssignment assignment : assignments) {
      recipients.add(assignment.getUser().getEmail());
    }

    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(recipients.toArray(new String[0]));
      message.setSubject("test");
      message.setText("body");

      mailSender.send(message);
    } catch (Exception e) {
      throw new RuntimeException("Failed to send email", e);
    }
  }
}
