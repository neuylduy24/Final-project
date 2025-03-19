package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.security.JwtUtil;
import com.btec.bookmanagement_api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Đăng ký tài khoản mới
     */
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email is already taken"));
        }
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username is already taken"));
        }

        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Verification email sent. Please verify your account."));
    }

    /**
     * Xác minh tài khoản bằng token
     */
    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam String token) {
        try {
            boolean isVerified = userService.verifyUser(token);
            if (isVerified) {
                return ResponseEntity.ok(Map.of("message", "Account successfully verified!"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid or expired verification token."));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Đăng nhập vào hệ thống
     */
    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        User user = userService.getUserByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        if (!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Account not verified. Please check your email."));
        }

        String roles = String.join(",", user.getRoles());
        String token = JwtUtil.generateToken(user.getEmail(), roles);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("roles", user.getRoles());

        return ResponseEntity.ok(response);
    }
}
