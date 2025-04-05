package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Feedback;
import com.btec.bookmanagement_api.services.BookService;
import com.btec.bookmanagement_api.services.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;
    private FeedbackService feedbackService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }



    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/title/{title}")
    public ResponseEntity<Book> getBookByTitle(@PathVariable String title) {
        return bookService.getBookByTitle(title)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Book> searchBooksByTitle(@RequestParam String title) {
        return bookService.searchBooksByTitle(title);
    }

    @GetMapping("/author/{authorId}")
    public List<Book> getBooksByAuthorId(@PathVariable String authorId) {
        return bookService.getBooksByAuthorId(authorId);
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody @Valid Book book) {
        try {
            return ResponseEntity.ok(bookService.createBook(book));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/sorted/by-date-desc")
    public ResponseEntity<List<Book>> getBooksSortedByCreatedDateDesc() {
        List<Book> books = bookService.getBooksSortedByCreatedDateDesc();
        return ResponseEntity.ok(books);
    }



    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadImage(@PathVariable String id,
                                              @RequestParam("file") MultipartFile file) {
        try {
            byte[] imageData = file.getBytes();
            boolean success = bookService.updateBookImage(id, imageData);
            return success ? ResponseEntity.ok("Image uploaded successfully")
                    : ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getBookImage(@PathVariable String id) {
        Optional<byte[]> imageData = bookService.getBookImage(id);
        if (imageData.isPresent()) {
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg")
                    .body(imageData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable String id, @RequestBody Book bookDetails) {
        try {
            return ResponseEntity.ok(bookService.updateBook(id, bookDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    // 2️⃣ API lấy thông tin sách + Feedback & Rating
    @GetMapping("/{id}/details")
    public ResponseEntity<Book> getBookWithFeedback(@PathVariable String id) {
        return bookService.getBookById(id)
                .map(book -> {
                    book.setFeedbacks(feedbackService.getFeedbacksByBookId(id));
                    book.setAverageRating(feedbackService.getAverageRating(id));
                    return ResponseEntity.ok(book);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}