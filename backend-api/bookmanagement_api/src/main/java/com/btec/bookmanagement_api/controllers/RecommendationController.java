package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.security.JwtUtil;
import com.btec.bookmanagement_api.services.BookService;
import com.btec.bookmanagement_api.services.RecommendationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService; // ✅ Sử dụng AI
    private final BookService bookService;

    @GetMapping("/personalized")
    public List<Book> getPersonalizedBooks(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = JwtUtil.extractEmail(token);
                return recommendationService.recommendBooks(email); // ✅ Gọi AI RecommendationService
            } catch (Exception e) {
                // Nếu token lỗi → fallback bằng sách phổ biến
                return bookService.getBooksByViews();
            }
        }

        // Nếu không có token → fallback bằng sách phổ biến
        return bookService.getBooksByViews();
    }
}
