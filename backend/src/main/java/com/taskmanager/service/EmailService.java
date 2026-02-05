package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    public boolean sendTaskReminder(User user, Task task) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            log.warn("Skipping reminder email. User {} has no email set.", user.getUsername());
            return false;
        }
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            log.warn("Skipping reminder email. Mail credentials are not configured.");
            return false;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setSubject("Task Reminder: " + task.getTaskName());
        message.setText(String.format(
                "Hello %s,%n%nThis is a reminder for your task:%n%nTask: %s%nDue Date: %s%nReminder Time: %s%n%nStay productive!%n",
                user.getUsername(),
                task.getTaskName(),
                task.getDueDate(),
                task.getReminderTime()
        ));

        mailSender.send(message);
        return true;
    }
}
