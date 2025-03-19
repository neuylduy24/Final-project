package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.repositories.UserRepository;
import com.btec.bookmanagement_api.security.JwtUtil;
import com.btec.bookmanagement_api.services.EmailService;
import com.btec.bookmanagement_api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository ;
    @Autowired
    private EmailService emailService;

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
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email,
                                                @RequestParam String otp,
                                                @RequestParam String newPassword) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Email không tồn tại!");
        }

        // 🛠 Kiểm tra mã OTP có hợp lệ không
        if (user.getResetPasswordCode().equals(otp) && LocalDateTime.now().isBefore(user.getResetCodeExpiry())) {
            user.setPassword(passwordEncoder.encode(newPassword)); // Cập nhật mật khẩu mới
            user.setResetPasswordCode(null); // Xóa mã OTP sau khi đặt lại
            user.setResetCodeExpiry(null);
            userRepository.save(user);
            return ResponseEntity.ok("✅ Mật khẩu đã được đặt lại thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Mã OTP không đúng hoặc đã hết hạn.");
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam("email") String email) {
        Map<String, String> response = new HashMap<>();

        // 🔍 Kiểm tra user có tồn tại không
        User user = userService.getUserByEmail(email);
        if (user == null) {
            response.put("message", "❌ Email không tồn tại!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // 🛠 Tạo mã OTP gồm 6 chữ số (đảm bảo luôn đủ 6 số)
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setResetPasswordCode(otp);
        user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(5)); // Hết hạn sau 5 phút
        userService.saveUser(user); // 🔄 Cập nhật thông tin user vào DB

        // ✉ Gửi email OTP (kiểm tra phương thức sendResetPasswordCode)
        try {
            emailService.sendResetPasswordCode(user.getEmail(), otp);
            response.put("message", "✅ Mã OTP đã được gửi vào email của bạn!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "❌ Gửi email thất bại: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }




}
