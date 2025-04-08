package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.enums.Role;
import com.btec.bookmanagement_api.repositories.RoleRepository;
import com.btec.bookmanagement_api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.entities.Category;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash password
        user.setRoles(Set.of("READER")); // Default role

        // Generate verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24)); // Token expires in 24 hours
        user.setVerified(false);

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), token);

        return user;
    }

    public boolean verifyUser(String token) {
        Optional<User> userOptional = userRepository.findByVerificationToken(token);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification token has expired.");
            }
            user.setVerified(true);
            user.setVerificationToken(null);
            user.setTokenExpiry(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }
    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(String id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setRoles(userDetails.getRoles());
            user.setAvatar(userDetails.getAvatar());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword())); // Hash new password
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public List<String> getFavoriteGenres(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty() || optionalUser.get().getFavoriteCategories() == null) {
            return List.of();
        }

        return optionalUser.get().getFavoriteCategories().stream()
                .filter(Objects::nonNull) // 🔒 tránh null trong danh sách
                .map(Category::getName)
                .filter(name -> name != null && !name.isBlank()) // 🔒 lọc tên null hoặc trống
                .collect(Collectors.toList());
    }


}