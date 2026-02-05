package com.taskmanager.service;

import com.taskmanager.entity.User;
import com.taskmanager.exception.UserAlreadyExistsException;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Trying to load user with username: " + username);

        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> {
                    System.out.println("USER NOT FOUND: " + username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

        System.out.println("User found in database: " + user.getUsername());
        System.out.println("Stored password (encoded): " + user.getPassword());
        System.out.println("=== END LOGIN ATTEMPT ===");

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

//    @Override
//    @Transactional(readOnly = true)
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//
//        return new org.springframework.security.core.userdetails.User(
//                user.getUsername(),
//                user.getPassword(),
//                new ArrayList<>()
//        );
//    }

//    @Transactional
//    public User registerUser(String username, String email, String password) {
//        if (userRepository.existsByUsername(username)) {
//            throw new UserAlreadyExistsException("Username already exists");
//        }
//
//        if (userRepository.existsByEmail(email)) {
//            throw new UserAlreadyExistsException("Email already exists");
//        }
//
//        User user = new User();
//        user.setUsername(username);
//        user.setEmail(email);
//        user.setPassword(passwordEncoder.encode(password));
//
//        return userRepository.save(user);
//    }

    @Transactional
    public User registerUser(String username, String email, String password) {
        System.out.println("=== REGISTRATION ===");
        System.out.println("Username: " + username);
        System.out.println("Email: " + email);
        System.out.println("Raw password length: " + password.length());

        if (userRepository.existsByUsername(username)) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        String encodedPassword = passwordEncoder.encode(password);
        System.out.println("Encoded password: " + encodedPassword);
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);
        System.out.println("User saved with ID: " + savedUser.getId());
        System.out.println("=== END REGISTRATION ===");

        return savedUser;
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Transactional(readOnly = true)
    public User getUserByUsernameOrEmail(String identifier) {
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identifier));
    }

    @Transactional
    public User updateUserProfile(User user, String email, String profileImage) {
        if (email != null && !email.isBlank() && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new UserAlreadyExistsException("Email already exists");
            }
            user.setEmail(email);
        }

        if (profileImage != null) {
            user.setProfileImage(profileImage);
        }

        return userRepository.save(user);
    }
}
