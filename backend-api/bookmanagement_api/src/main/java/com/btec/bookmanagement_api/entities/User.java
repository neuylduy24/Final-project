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
    private String id;  // MongoDB tự động sinh ObjectId, không cần @GeneratedValue

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Min(value = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Username is required")
    private String username;

    private Set<String> roles;  // Danh sách các vai trò (User, Admin, Moderator, ...)

    private String avatar;  // Ảnh đại diện

    private List<String> favoriteCategories;  // Thể loại yêu thích

    private List<String> searchHistory;  // Lịch sử tìm kiếm

    private List<String> bookmarkedBooks;  // Danh sách sách đã lưu

    private List<ReadingHistory> readingHistory; // Lịch sử đọc sách

    private LocalDateTime createdAt = LocalDateTime.now();


}
