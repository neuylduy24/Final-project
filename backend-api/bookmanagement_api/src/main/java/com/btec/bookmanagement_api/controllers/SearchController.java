package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ChapterRepository chapterRepository;

    @GetMapping
    public List<Book> searchBooks(@RequestParam("q") String keyword) {
        Set<Book> resultSet = new HashSet<>();

        // 1. Tìm sách theo tiêu đề
        List<Book> booksByTitle = bookRepository.findByTitleContainingIgnoreCase(keyword);
        resultSet.addAll(booksByTitle);

        List<Book> booksByDescription = bookRepository.findByDescriptionContainingIgnoreCase(keyword);
        resultSet.addAll(booksByDescription);

        // 2. Tìm các chapter có chứa nội dung keyword
        List<Chapter> chaptersWithKeyword = chapterRepository.findByContentContainingIgnoreCase(keyword);
        for (Chapter chapter : chaptersWithKeyword) {
            if (chapter.getBookId() != null) {
                bookRepository.findById(chapter.getBookId()).ifPresent(resultSet::add);
            }
        }

        return new ArrayList<>(resultSet);
    }

    @PostMapping("/image")
    public ResponseEntity<?> searchByImage(@RequestParam("file") MultipartFile file) throws IOException {
        byte[] uploadedBytes = file.getBytes();

        List<Book> books = bookRepository.findAll();

        for (Book book : books) {
            if (book.getImageData() != null && Arrays.equals(book.getImageData(), uploadedBytes)) {
                return ResponseEntity.ok(book);
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No matching book found.");
    }
}
