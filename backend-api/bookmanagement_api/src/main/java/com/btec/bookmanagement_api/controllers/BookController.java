package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Feedback;
import com.btec.bookmanagement_api.services.BookService;
import com.btec.bookmanagement_api.services.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/author/{author}")
    public List<Book> getBooksByAuthor(@PathVariable String author) {
        return bookService.getBooksByAuthor(author);
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody @Valid Book book) {
        try {
            return ResponseEntity.ok(bookService.createBook(book));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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