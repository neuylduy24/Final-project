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

    // Thay đổi từ userId sang email trong các endpoint
    @GetMapping("/user/{email}")
    public List<FollowBook> getFollowBooksByEmail(@PathVariable String email) {
        return followBookService.getFollowBooksByEmail(email);
    }

    @GetMapping("/user/{email}/book/{bookId}")
    public ResponseEntity<FollowBook> getFollowBookByEmailAndBook(
            @PathVariable String email,
            @PathVariable String bookId) {
        return followBookService.getFollowBookByEmailAndBook(email, bookId)
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

    // Thay đổi từ userId sang email
    @DeleteMapping("/user/{email}/book/{bookId}")
    public ResponseEntity<Void> deleteFollowBookByEmailAndBook(
            @PathVariable String email,
            @PathVariable String bookId) {
        followBookService.deleteFollowBookByEmailAndBook(email, bookId);
        return ResponseEntity.noContent().build();
    }
}