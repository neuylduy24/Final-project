package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.services.RecommendationService;
import com.btec.bookmanagement_api.services.BookService;
import com.btec.bookmanagement_api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final BookService bookService;
    private final RecommendationService recommendationService;

    @GetMapping("/for-you")
    public List<Book> getForYou(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Bỏ "Bearer "
            try {
                String email = JwtUtil.extractEmail(token);
                return recommendationService.recommendBooks(email);
            } catch (Exception e) {
                // Token không hợp lệ hoặc đã hết hạn → trả về sách theo lượt xem
                return bookService.getBooksByViews();
            }
        }

        // Nếu không có token → trả về sách phổ biến
        return bookService.getBooksByViews();
    }
}
