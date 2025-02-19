package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.BookMark;
import com.btec.bookmanagement_api.services.BookMarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookMarkController {
    @Autowired
    private BookMarkService bookmarkService;

    @GetMapping("/user/{userId}")
    public List<BookMark> getBookmarksByUserId(@PathVariable String userId) {
        return bookmarkService.getBookmarksByUserId(userId);
    }

    @GetMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<BookMark> getBookmarkByUserAndBook(@PathVariable String userId, @PathVariable String bookId) {
        return bookmarkService.getBookmarkByUserAndBook(userId, bookId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBookMark(@RequestBody BookMark bookmark) {
        try {
            return ResponseEntity.ok(bookmarkService.createBookmark(bookmark));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookMark(@PathVariable String id) {
        bookmarkService.deleteBookmark(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<Void> deleteBookMarkByUserAndBook(@PathVariable String userId, @PathVariable String bookId) {
        bookmarkService.deleteBookmarkByUserAndBook(userId, bookId);
        return ResponseEntity.noContent().build();
    }
}