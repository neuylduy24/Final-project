package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dialogflow")
public class DialogflowController {

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/webhook")
    public Map<String, Object> handleDialogflow(@RequestBody Map<String, Object> request) {
        Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
        Map<String, Object> parameters = (Map<String, Object>) queryResult.get("parameters");

        String bookTopic = (String) parameters.get("book_topic"); // 🔥 Lấy chủ đề sách từ @sys.any

        if (bookTopic == null || bookTopic.isEmpty()) {
            return Map.of("fulfillmentText", "Bạn có thể nói rõ hơn về chủ đề sách bạn muốn tìm không?");
        }

        List<Book> books = bookRepository.searchBooks(bookTopic);

        if (books.isEmpty()) {
            return Map.of("fulfillmentText", "Xin lỗi, tôi không tìm thấy sách nào về " + bookTopic + " trong thư viện.");
        }

        StringBuilder responseText = new StringBuilder("Tôi tìm thấy một số sách về " + bookTopic + ":\n");
        for (Book book : books) {
            responseText.append("- ").append(book.getTitle()).append(" của ").append(book.getAuthor()).append("\n");
        }

        return Map.of("fulfillmentText", responseText.toString());
    }

}