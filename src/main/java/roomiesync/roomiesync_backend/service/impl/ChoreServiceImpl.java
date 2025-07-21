package roomiesync.roomiesync_backend.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
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

    String subject = "Chore Reminder: " + chore.getName();
    String body;
    User recipient;
    for (ChoreAssignment assignment : assignments) {
      try {
        recipient = assignment.getUser();
        body = "Reminder: You are assigned to the chore \"" + chore.getName() + "\".\n" +
                "Description: " + chore.getDescription() + ".\n" +
                "Due date: " + assignment.getDueDate() + "\n" + "\n" +
                "Best," + "\n" +
                "RoomieSync";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(recipient.getEmail());
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
      } catch (Exception e) {
        throw new RuntimeException("Failed to send email", e);
      }
    }
  }

  @Override
  @Scheduled(fixedRate = 1, timeUnit = TimeUnit.DAYS)
  public void cleanupExpiredAssignments() {
    try {
      LocalDateTime now = LocalDateTime.now();
      choreAssignmentRepository.deleteExpiredAssignments(now);
    } catch (Exception e) {
      throw new RuntimeException("Failed to delete expired assignments", e);
    }
  }
}
