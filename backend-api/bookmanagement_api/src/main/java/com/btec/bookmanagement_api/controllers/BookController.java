package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.Feedback;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.services.BookService;
import com.btec.bookmanagement_api.services.FeedbackService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;
    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private BookRepository bookRepository;

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

    @GetMapping("/author")
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
    @GetMapping("/sorted/by-date-desc")
    public ResponseEntity<List<Book>> getBooksSortedByCreatedDateDesc() {
        List<Book> books = bookService.getBooksSortedByCreatedDateDesc();
        return ResponseEntity.ok(books);
    }



//    @PostMapping("/{id}/upload-image")
//    public ResponseEntity<String> uploadImage(@PathVariable String id,
//                                              @RequestParam("file") MultipartFile file) {
//        Optional<Book> bookOpt = bookRepository.findById(id);
//
//        if (bookOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body("Book not found with id " + id);
//        }
//
//        Book book = bookOpt.get();
//
//        // Kiểm tra xem sách đã có ảnh bằng URL chưa
//        if (book.getImage() != null && !book.getImage().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body("This book already has an image URL. You cannot upload a new image.");
//        }
//
//        // Tiến hành xử lý ảnh upload
//        try {
//            byte[] imageData = file.getBytes();
//
//            // Kiểm tra trùng ảnh (dùng hàm hash ảnh nếu có)
//            String imageHash = bookService.calculateImageHash(imageData);  // Gọi phương thức calculateImageHash
//            Optional<Book> duplicateImageBook = bookRepository.findByImageHash(imageHash);
//
//            if (duplicateImageBook.isPresent()) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body("This image is already used by another book.");
//            }
//
//            // Cập nhật ảnh cho sách
//            book.setImageData(imageData);
//            book.setImageHash(imageHash); // Lưu hash của ảnh vào sách
//            bookRepository.save(book);
//
//            return ResponseEntity.ok("Image uploaded successfully");
//
//        } catch (IOException | NoSuchAlgorithmException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to upload image");
//        }
//    }

    @PostMapping("/create-with-image")
    public ResponseEntity<?> createBookWithImage(
            @RequestParam String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String imageUrl,
            @RequestParam(required = false) MultipartFile file
    ) {
        try {
            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);

            if (category != null && !category.isBlank()) {
                Category cat = new Category();
                cat.setName(category);
                book.setCategories(List.of(cat));
            }

            if (file != null && !file.isEmpty()) {
                byte[] imageData = file.getBytes();
                String imageHash = bookService.calculateImageHash(imageData);

                Optional<Book> duplicate = bookRepository.findByImageHash(imageHash);
                if (duplicate.isPresent()) {
                    return ResponseEntity.badRequest().body("This image is already used by another book.");
                }

                book.setImageData(imageData);
                book.setImageHash(imageHash);
            } else if (imageUrl != null && !imageUrl.isBlank()) {
                book.setImage(imageUrl);
            }

            Book created = bookService.createBook(book);
            return ResponseEntity.ok(created);
        } catch (IOException | NoSuchAlgorithmException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload image: " + e.getMessage());
        }
    }



    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getBookImage(@PathVariable String id) {
        Optional<byte[]> imageOpt = bookService.getBookImage(id);
        if (imageOpt.isPresent()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG); // hoặc IMAGE_PNG
            return new ResponseEntity<>(imageOpt.get(), headers, HttpStatus.OK);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/most-viewed")
    public ResponseEntity<List<Book>> getMostViewedBooks() {
        List<Book> books = bookService.getBooksByViews();
        return ResponseEntity.ok(books);
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