package com.btec.bookmanagement_api.entities;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users") // Định nghĩa collection MongoDB
public class User {
    @Id
    private String id;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Min(value = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Username is required")
    private String username;

    private Set<String> roles;

    private String avatar;

    private List<String> favoriteCategories;

    private List<String> searchHistory;

    private List<String> bookmarkedBooks;

    private List<ReadingHistory> readingHistory;

    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean enabled = false;
    private boolean isVerified = false;// Mặc định tài khoản chưa kích hoạt

    private String verificationToken;  // Token xác minh email

    private LocalDateTime tokenExpiry; // Thời gian hết hạn token
}
