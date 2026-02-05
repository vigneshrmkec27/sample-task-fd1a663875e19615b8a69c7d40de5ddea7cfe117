package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.service.TaskService;
import com.taskmanager.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;


import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        TaskResponse response = taskService.createTask(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        Page<TaskResponse> tasks = taskService.getAllTasks(user, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        TaskResponse response = taskService.getTaskById(id, user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        TaskResponse response = taskService.updateTask(id, request, user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        taskService.deleteTask(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TaskResponse>> searchTasks(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        Page<TaskResponse> tasks = taskService.searchTasks(user, query, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/filter/priority/{priority}")
    public ResponseEntity<Page<TaskResponse>> filterByPriority(
            @PathVariable Task.Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        Page<TaskResponse> tasks = taskService.filterByPriority(user, priority, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/filter/status/{status}")
    public ResponseEntity<Page<TaskResponse>> filterByStatus(
            @PathVariable Task.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        Page<TaskResponse> tasks = taskService.filterByStatus(user, status, page, size);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<TaskResponse>> getTasksByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        List<TaskResponse> tasks = taskService.getTasksByDate(user, date);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTasksToCsv(Authentication authentication) {

        User user = userService.getUserByUsername(authentication.getName());

        List<TaskResponse> tasks = taskService.getAllTasks(user, 0, Integer.MAX_VALUE)
                .getContent();

        StringBuilder csv = new StringBuilder();

// ✅ PLACE THIS LINE HERE (CSV HEADER)
        csv.append("ID,Task Name,Description,Status,Priority,Due Date,Created Date,Updated Date\n");


        for (TaskResponse task : tasks) {
            csv.append(task.getId()).append(",")
                    .append(escape(task.getTaskName())).append(",")   // ✅ taskName
                    .append(escape(task.getDescription())).append(",")
                    .append(task.getStatus()).append(",")
                    .append(task.getPriority()).append(",")
                    .append(task.getDueDate()).append(",")
                    .append(task.getCreatedDate()).append(",")        // ✅ createdDate
                    .append(task.getUpdatedDate()).append("\n");      // ✅ updatedDate
        }



        byte[] csvBytes = csv.toString().getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tasks.csv");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(csvBytes);
    }
    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }


}
