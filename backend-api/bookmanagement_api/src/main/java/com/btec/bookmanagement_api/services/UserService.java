package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.enums.Role;
import com.btec.bookmanagement_api.repositories.RoleRepository;
import com.btec.bookmanagement_api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private RoleRepository roleRepository;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

//    public Optional<User> getUserByUsername(String username) {
//        return userRepository.findByUsername(username);
//    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User createUser(User user) {
        // Hash the password before saving
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Hash password

        HashSet<String> roles = new HashSet<>();
        roles.add(Role.READER.name());

        user.setRoles(roles);

        return userRepository.save(user);
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

}
