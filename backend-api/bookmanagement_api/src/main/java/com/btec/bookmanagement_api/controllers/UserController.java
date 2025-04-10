package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.UserRepository;
import com.btec.bookmanagement_api.security.JwtUtil;
import com.btec.bookmanagement_api.services.ReadingHistoryService;
import com.btec.bookmanagement_api.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    private UserRepository userRepository;
    private BookRepository bookRepository;
    private ReadingHistoryService readingHistoryService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

//    @PutMapping("/{userId}/favorite-categories")
//    public User updateFavoriteCategories(@PathVariable String userId, @RequestBody List<String> categories) {
//        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//        user.setFavoriteCategories(categories);
//        return userRepository.save(user);
//    }




    @PutMapping("/{userId}/reading-history")
    public User updateReadingHistory(@PathVariable String userId, @RequestBody ReadingHistory history) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra nếu sách đã có trong lịch sử thì cập nhật, nếu chưa có thì thêm mới
        boolean found = false;
        for (ReadingHistory rh : user.getReadingHistory()) {
            if (rh.getBookId().equals(history.getBookId())) {
                rh.setProgress(history.getProgress());
                rh.setTimeSpent(rh.getTimeSpent() + history.getTimeSpent());
                rh.setLastReadAt(Instant.now());
                found = true;
                break;
            }
        }
        if (!found) {
            history.setLastReadAt(Instant.now());
            user.getReadingHistory().add(history);
        }

        return userRepository.save(user);
    }


    @PostMapping("/favorite-categories")
    public ResponseEntity<?> saveFavoriteCategories(
            @RequestBody FavoriteCategoryRequest request,
            HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            String email = JwtUtil.extractEmail(token.substring(7));
            userService.saveFavoriteCategories(email, request.getFavoriteCategories());
            return ResponseEntity.ok("Saved successfully");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }

    @Getter
    @Setter
    public static class FavoriteCategoryRequest {
        private List<String> favoriteCategories;
    }

    @PutMapping("/users/update-reading-history")
    public ResponseEntity<?> updateReadingHistory(
            HttpServletRequest request,
            @RequestBody ReadingHistory updateRequest
    ) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            String email = JwtUtil.extractEmail(token);
            User user = userService.getUserByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            readingHistoryService.updateReadingHistory(
                    user.getId(),
                    email,
                    updateRequest.getBookId(),
                    updateRequest.getChapterId(),
                    updateRequest.getProgress(),
                    updateRequest.getTimeSpent()
            );

            return ResponseEntity.ok("Reading history updated successfully");
        } catch (Exception e) {
            e.printStackTrace(); // <== Quan trọng để log lỗi chi tiết
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }




    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestParam String token) {
        boolean isValid = false;
        try {
            isValid = JwtUtil.verifyToken(token);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return isValid ? ResponseEntity.ok("Valid token") : ResponseEntity.status(401).body("Invalid or expired token");
    }
}