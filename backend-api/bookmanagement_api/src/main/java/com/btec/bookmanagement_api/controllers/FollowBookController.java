package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.FollowBook;
import com.btec.bookmanagement_api.services.FollowBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-books")
public class FollowBookController {
    @Autowired
    private FollowBookService followBookService;

    @GetMapping("/user/{userId}")
    public List<FollowBook> getFollowBooksByUserId(@PathVariable String userId) {
        return followBookService.getFollowBooksByUserId(userId);
    }

    @GetMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<FollowBook> getFollowBookByUserAndBook(@PathVariable String userId, @PathVariable String bookId) {
        return followBookService.getFollowBookByUserAndBook(userId, bookId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createFollowBook(@RequestBody FollowBook followBook) {
        try {
            return ResponseEntity.ok(followBookService.createFollowBook(followBook));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowBook(@PathVariable String id) {
        followBookService.deleteFollowBook(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<Void> deleteFollowBookByUserAndBook(@PathVariable String userId, @PathVariable String bookId) {
        followBookService.deleteFollowBookByUserAndBook(userId, bookId);
        return ResponseEntity.noContent().build();
    }
}
