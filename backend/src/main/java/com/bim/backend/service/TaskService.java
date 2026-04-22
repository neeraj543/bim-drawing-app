package com.bim.backend.service;

import com.bim.backend.dto.CreateTaskRequest;
import com.bim.backend.dto.TaskResponse;
import com.bim.backend.dto.UpdateTaskRequest;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Task;
import com.bim.backend.entity.User;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.DrawingSetRepository;
import com.bim.backend.repository.TaskRepository;
import com.bim.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DrawingSetRepository drawingSetRepository;

    public List<TaskResponse> getAllTasks() {
        User currentUser = getCurrentUser();
        List<Task> tasks = currentUser.getRole() == User.Role.ADMIN
                ? taskRepository.findAll()
                : taskRepository.findByAssignedUser(currentUser);
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        return mapToResponse(taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id)));
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedUserId()));
        DrawingSet drawingSet = drawingSetRepository.findById(request.getDrawingSetId())
                .orElseThrow(() -> new ResourceNotFoundException("Drawing set not found with id: " + request.getDrawingSetId()));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? Task.TaskStatus.valueOf(request.getStatus()) : Task.TaskStatus.TO_DO)
                .priority(request.getPriority() != null ? Task.Priority.valueOf(request.getPriority()) : Task.Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .assignedUser(assignedUser)
                .drawingSet(drawingSet)
                .createdBy(currentUser)
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        User currentUser = getCurrentUser();

        if (currentUser.getRole() != User.Role.ADMIN && !task.getAssignedUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(Task.TaskStatus.valueOf(request.getStatus()));
        if (request.getPriority() != null) task.setPriority(Task.Priority.valueOf(request.getPriority()));
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getAssignedUserId() != null && currentUser.getRole() == User.Role.ADMIN) {
            User newAssignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedUserId()));
            task.setAssignedUser(newAssignedUser);
        }

        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .drawingSetId(task.getDrawingSet().getId())
                .drawingSetName(task.getDrawingSet().getName())
                .assignedUserId(task.getAssignedUser().getId())
                .assignedUserName(task.getAssignedUser().getUsername())
                .createdById(task.getCreatedBy().getId())
                .createdByName(task.getCreatedBy().getUsername())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
