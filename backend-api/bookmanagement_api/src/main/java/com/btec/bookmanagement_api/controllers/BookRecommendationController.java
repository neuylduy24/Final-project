package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.Category;
import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.entities.User;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.services.ReadingHistoryService;
import com.btec.bookmanagement_api.services.UserService;
import com.btec.bookmanagement_api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookRecommendationController {

    private final BookRepository bookRepository;
    private final UserService userService;
    private final ReadingHistoryService readingHistoryService;

    @GetMapping("/recommend-by-categories")
    public List<Book> recommendBooksByCategories(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Collections.emptyList();
        }

        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        if (email == null) {
            return Collections.emptyList();
        }

        User user = userService.getUserByEmail(email);
        Set<String> categoryNames = new HashSet<>();

        // 1. Thể loại yêu thích
        if (user.getFavoriteCategories() != null) {
            user.getFavoriteCategories().forEach(cat -> categoryNames.add(cat.getName()));
        }

        // 2. Thể loại từ truyện đọc gần đây nhất
        List<ReadingHistory> historyList = readingHistoryService.getUserReadingHistory(email);
        historyList.stream()
                .sorted((a, b) -> b.getLastReadAt().compareTo(a.getLastReadAt())) // mới nhất
                .findFirst()
                .ifPresent(recent -> {
                    if (recent.getBook() != null && recent.getBook().getCategories() != null) {
                        recent.getBook().getCategories().forEach(cat -> categoryNames.add(cat.getName()));
                    }
                });

        // 3. Từ khóa tìm kiếm → tìm sách, lấy thể loại
        if (user.getSearchHistory() != null) {
            for (String keyword : user.getSearchHistory()) {
                List<Book> matchedBooks = bookRepository.findByTitleContainingIgnoreCase(keyword);
                for (Book book : matchedBooks) {
                    if (book.getCategories() != null) {
                        book.getCategories().forEach(cat -> categoryNames.add(cat.getName()));
                    }
                }
            }
        }

        if (categoryNames.isEmpty()) {
            return bookRepository.findRandomBooks(10);
        }

        return bookRepository.findByCategoryNames(new ArrayList<>(categoryNames));
    }
}
