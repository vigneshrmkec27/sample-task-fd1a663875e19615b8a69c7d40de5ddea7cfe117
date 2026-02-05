package com.taskmanager.controller;

import com.taskmanager.dto.UserProfileResponse;
import com.taskmanager.dto.UserProfileUpdateRequest;
import com.taskmanager.entity.User;
import com.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName());

        return ResponseEntity.ok(toProfileResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @Valid @RequestBody UserProfileUpdateRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByUsername(authentication.getName());
        User updatedUser = userService.updateUserProfile(user, request.getEmail(), request.getProfileImage());
        return ResponseEntity.ok(toProfileResponse(updatedUser));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getProfileImage(),
                user.getCreatedAt()
        );
    }
}
