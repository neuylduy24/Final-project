package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.services.ChatbotService;
import com.btec.bookmanagement_api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;
    private final UserService userService;
    private final BookRepository bookRepository;

    // ✅ API: Chat hỏi AI tổng quát (KHÔNG cần đăng nhập)
    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> chatWithAI(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        // Sử dụng phương thức answerProjectDataQuestion thay vì chatWithAI
        // để trả lời các câu hỏi liên quan đến dữ liệu của hệ thống
        String reply = chatbotService.answerProjectDataQuestion(message);
        
        // Return as a JSON object with "answer" key
        Map<String, String> response = new HashMap<>();
        response.put("answer", reply);
        return ResponseEntity.ok(response);
    }

    // ✅ API: Gợi ý truyện theo AI (KHÔNG cần đăng nhập)
    @PostMapping("/recommend")
    public ResponseEntity<String> recommendBookByAI(@RequestBody Map<String, String> request) {
        String input = request.get("message");

        // Gửi null vì không có user → AI gợi ý ngẫu nhiên / theo trend
        String suggestion = chatbotService.recommendBookByAI(null, input);
        return ResponseEntity.ok(suggestion);
    }

    // ✅ API: Tóm tắt truyện (truyền vào tên truyện, không cần token)
    @GetMapping("/summarize")
    public ResponseEntity<String> summarizeBook(@RequestParam String title) {
        List<Book> matchedBooks = bookRepository.findByTitleContainingIgnoreCase(title);

        if (matchedBooks.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy truyện có tiêu đề chứa: " + title);
        }

        Book selectedBook = matchedBooks.get(0);
        String summary = chatbotService.summarizeBook(selectedBook);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/project-data")
    public ResponseEntity<String> answerProjectDataQuestion(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Please provide a question about the project data");
        }
        
        String answer = chatbotService.answerProjectDataQuestion(question);
        return ResponseEntity.ok(answer);
    }
}
