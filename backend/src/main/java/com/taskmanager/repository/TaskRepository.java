package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND LOWER(t.taskName) LIKE LOWER(CONCAT('%', :searchQuery, '%'))")
    Page<Task> searchByTaskName(@Param("userId") Long userId, @Param("searchQuery") String searchQuery, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.priority = :priority")
    Page<Task> findByUserIdAndPriority(@Param("userId") Long userId, @Param("priority") Task.Priority priority, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    Page<Task> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Task.Status status, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.dueDate = :date")
    List<Task> findByUserIdAndDueDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.reminderTime IS NOT NULL AND t.reminderTime <= :now AND t.reminderSent = false")
    List<Task> findTasksForReminder(@Param("now") LocalDateTime now);

    long countByUserIdAndStatus(Long userId, Task.Status status);
}
