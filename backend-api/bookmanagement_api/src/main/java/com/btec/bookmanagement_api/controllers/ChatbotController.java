package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.services.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private OpenAiService openAiService;

    @Autowired
    private BookRepository bookRepository;

    // ✅ 1. Trò chuyện với AI
    @PostMapping("/ask")
    public String askChatbot(@RequestBody Map<String, String> request) {
        String question = request.get("message");
        String prompt = "Bạn là trợ lý đọc truyện. Hãy trả lời: " + question;
        return openAiService.getRecommendation(prompt);
    }

    // ✅ 2. Tìm sách theo mô tả AI phản hồi
    @PostMapping("/recommend-book")
    public Optional<Book> recommendBook(@RequestBody Map<String, String> request) {
        String userInput = request.get("message");
        String prompt = "Hãy đề xuất tên truyện phù hợp với yêu cầu sau: " + userInput;

        String aiResponse = openAiService.getRecommendation(prompt);

        List<Book> books = bookRepository.findAll();
        return books.stream()
                .filter(book -> aiResponse.toLowerCase().contains(book.getTitle().toLowerCase()))
                .findFirst();
    }

    // ✅ 3. Tìm kiếm sách thủ công theo từ khóa
    @GetMapping("/search-book")
    public List<Book> searchBook(@RequestParam String query) {
        return bookRepository.searchBooks(query);
    }

    // ✅ 4. Tìm sách theo mô tả nội dung
    @GetMapping("/find-book")
    public Optional<Book> findBookByDescription(@RequestParam String description) {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .filter(book -> book.getDescription().toLowerCase().contains(description.toLowerCase()))
                .findFirst();
    }
}
