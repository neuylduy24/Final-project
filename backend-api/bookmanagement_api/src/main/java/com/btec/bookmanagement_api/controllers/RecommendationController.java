package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.security.JwtUtil;
import com.btec.bookmanagement_api.services.PersonalizedRecommendationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final PersonalizedRecommendationService personalizedRecommendationService;

    @GetMapping("/personalized")
    public List<Book> getPersonalizedBooks(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = JwtUtil.extractEmail(token);
                return personalizedRecommendationService.recommendBooks(email);
            } catch (Exception e) {
                // Token lỗi → trả về rỗng hoặc có thể fallback
                return List.of();
            }
        }

        return List.of(); // Không có token → không gợi ý
    }
}
