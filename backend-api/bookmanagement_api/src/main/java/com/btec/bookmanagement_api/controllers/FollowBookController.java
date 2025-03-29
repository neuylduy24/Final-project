package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.FollowBook;
import com.btec.bookmanagement_api.services.FollowBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-books")
public class FollowBookController {

    private final FollowBookService followBookService;

    public FollowBookController(FollowBookService followBookService) {
        this.followBookService = followBookService;
    }

    @GetMapping
    public ResponseEntity<List<FollowBook>> getAllFollowBooks() {
        List<FollowBook> followBooks = followBookService.getAllFollowBooks();
        return ResponseEntity.ok(followBooks);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<FollowBook>> getFollowBooksByUserId(@PathVariable String userId) {
        List<FollowBook> followBooks = followBookService.getFollowBooksByUserId(userId);
        if (followBooks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(followBooks);
    }

    @GetMapping("/users/{userId}/books/{bookId}")
    public ResponseEntity<FollowBook> getFollowBookByUserAndBook(@PathVariable String userId, @PathVariable String bookId) {
        return followBookService.getFollowBookByUserAndBook(userId, bookId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FollowBook> createFollowBook(@RequestBody FollowBook followBook) {
        FollowBook createdFollowBook = followBookService.createFollowBook(followBook);
        return ResponseEntity.ok(createdFollowBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowBook(@PathVariable String id) {
        followBookService.deleteFollowBook(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{userId}/books/{bookId}")
    public ResponseEntity<Void> deleteFollowBookByUserAndBook(@PathVariable String userId, @PathVariable String bookId) {
        followBookService.deleteFollowBookByUserAndBook(userId, bookId);
        return ResponseEntity.noContent().build();
    }
}
