package com.bim.backend.controller;

import com.bim.backend.dto.CreateTaskRequest;
import com.bim.backend.dto.TaskResponse;
import com.bim.backend.dto.UpdateTaskRequest;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Task;
import com.bim.backend.entity.User;
import com.bim.backend.repository.DrawingSetRepository;
import com.bim.backend.repository.TaskRepository;
import com.bim.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final DrawingSetRepository drawingSetRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository, DrawingSetRepository drawingSetRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.drawingSetRepository = drawingSetRepository;
    }

    // Get all tasks (admin sees all, regular users see only their assigned tasks)
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks;
        if (currentUser.getRole() == User.Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssignedUser(currentUser);
        }

        List<TaskResponse> response = tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Get a single task by ID
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return ResponseEntity.ok(mapToResponse(task));
    }

    // Create a new task (admin only)
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody CreateTaskRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only admins can create tasks
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        DrawingSet drawingSet = drawingSetRepository.findById(request.getDrawingSetId())
                .orElseThrow(() -> new RuntimeException("Drawing set not found"));

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

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedTask));
    }

    // Update a task
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Regular users can only update tasks assigned to them, admins can update any task
        if (currentUser.getRole() != User.Role.ADMIN && !task.getAssignedUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(Task.TaskStatus.valueOf(request.getStatus()));
        }
        if (request.getPriority() != null) {
            task.setPriority(Task.Priority.valueOf(request.getPriority()));
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssignedUserId() != null && currentUser.getRole() == User.Role.ADMIN) {
            User newAssignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedUser(newAssignedUser);
        }

        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(mapToResponse(updatedTask));
    }

    // Delete a task (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only admins can delete tasks
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);
        return ResponseEntity.noContent().build();
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
