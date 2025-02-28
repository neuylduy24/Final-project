package com.btec.bookmanagement_api.entities;

import com.fasterxml.jackson.databind.annotation.JsonPOJOBuilder;
import com.mongodb.connection.ProxySettings;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    @Min(value = 6, message = "Password must be at least 6 characters")
    private String password;
    @NotBlank(message = "Username is required")
    private String username;
    Set<String> roles;
    private String avatar;
    private List<String> favoriteCategories;  // Thể loại yêu thích
    private List<String> searchHistory;       // Lịch sử tìm kiếm
    private List<String> bookmarkedBooks;     // Danh sách sách đã lưu

    private List<ReadingHistory> readingHistory; // Lịch sử đọc sách
    private LocalDateTime createdAt = LocalDateTime.now();

//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public Set<String> getRoles() {
//        return roles;
//    }
//
//    public void setRoles(Set<String> roles) {
//        this.roles = roles;
//    }
//
//    //    public Role getRoles() {
////        return roleId;
////    }
////
////    public void setRoles(Role roleId) {
////        this.roleId = roleId;
////    }
//
//    public String getAvatar() {
//        return avatar;
//    }
//
//    public void setAvatar(String avatar) {
//        this.avatar = avatar;
//    }
//
//    public LocalDateTime getCreatedAt() {
//        return createdAt;
//    }
//
//    public void setCreatedAt(LocalDateTime createdAt) {
//        this.createdAt = createdAt;
//    }
}
