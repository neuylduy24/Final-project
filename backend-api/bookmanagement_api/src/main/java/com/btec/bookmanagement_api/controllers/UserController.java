package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.repositories.UserRepository;
import com.btec.bookmanagement_api.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    private UserRepository userRepository;

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

    @PutMapping("/{userId}/favorite-categories")
    public User updateFavoriteCategories(@PathVariable String userId, @RequestBody List<String> categories) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFavoriteCategories(categories);
        return userRepository.save(user);
    }


    @PutMapping("/{userId}/bookmark-book/{bookId}")
    public User bookmarkBook(@PathVariable String userId, @PathVariable String bookId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getBookmarkedBooks().contains(bookId)) {
            user.getBookmarkedBooks().add(bookId);
        }
        return userRepository.save(user);
    }

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


    @DeleteMapping("/{userId}/remove-bookmark/{bookId}")
    public User removeBookmarkedBook(@PathVariable String userId, @PathVariable String bookId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getBookmarkedBooks().remove(bookId);
        return userRepository.save(user);
    }

    @GetMapping("/{userId}/bookmarked-books")
    public List<String> getBookmarkedBooks(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getBookmarkedBooks();
    }
}
