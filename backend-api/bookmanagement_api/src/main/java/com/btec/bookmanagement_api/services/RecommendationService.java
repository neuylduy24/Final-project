package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.FollowBook;
import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BookRepository bookRepository;
    private final GeminiService geminiService; 
    private final ReadingHistoryService readingHistoryService;
    private final FollowBookService followBookService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<Book> recommendBooks(String email) {
        List<Book> readBooks = getBooksUserRead(email);
        List<FollowBook> followedBooks = followBookService.getFollowBooksByEmail(email);
        List<String> favoriteCategories = userService.getFavoriteCategories(email);

        boolean hasNoData = readBooks.isEmpty() && followedBooks.isEmpty() && favoriteCategories.isEmpty();
        if (hasNoData) {
            return bookRepository.findRandomBooks(10);
        }

        String prompt = createPrompt(readBooks, followedBooks, favoriteCategories);
        System.out.println("📌 Prompt gửi cho Gemini:\n" + prompt); 

        String aiResponse = geminiService.getRecommendation(prompt); 

        List<String> titles = parseAiResponse(aiResponse)
                .stream()
                .limit(10)
                .collect(Collectors.toList());

        if (titles.isEmpty()) {
            // Nếu AI không trả về kết quả nào hợp lệ → fallback
            return bookRepository.findRandomBooks(10);
        }

        return bookRepository.findByTitleIn(titles);
    }

    private List<Book> getBooksUserRead(String email) {
        // Bước 1: Lấy danh sách lịch sử đọc của người dùng theo email
        List<ReadingHistory> historyList = readingHistoryService.getUserReadingHistory(email);

        // Bước 2: Lấy danh sách bookId từ historyList
        List<String> bookIds = historyList.stream()
                .map(ReadingHistory::getBookId)         // Lấy bookId
                .filter(Objects::nonNull)               // Bỏ bookId null
                .distinct()                             // Loại bỏ trùng lặp
                .collect(Collectors.toList());

        // Bước 3: Truy vấn DB để lấy Book dựa trên danh sách bookId
        return bookRepository.findAllById(bookIds);
    }

    private String createPrompt(List<Book> readBooks, List<FollowBook> followedBooks, List<String> favoriteCategories) {

        StringBuilder prompt = new StringBuilder("Tôi cần gợi ý sách cho người dùng dựa trên các dữ liệu sau:\n");

        if (!readBooks.isEmpty()) {
            String readTitles = readBooks.stream()
                    .map(Book::getTitle)
                    .filter(Objects::nonNull)
                    .collect(Collectors.joining(", "));
            prompt.append("- Đã đọc: ").append(readTitles).append("\n");
        }

        if (!followedBooks.isEmpty()) {
            List<String> bookIds = followedBooks.stream()
                    .map(FollowBook::getBookId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            List<Book> followedBookList = bookRepository.findAllById(bookIds);

            String followTitles = followedBookList.stream()
                    .map(Book::getTitle)
                    .filter(Objects::nonNull)
                    .collect(Collectors.joining(", "));
            prompt.append("- Đã theo dõi: ").append(followTitles).append("\n");
        }

        if (!favoriteCategories.isEmpty()) {
            String categories = String.join(", ", favoriteCategories);
            prompt.append("- Thể loại yêu thích: ").append(categories).append("\n");
        }

        prompt.append("Hãy gợi ý tối đa 10 truyện phù hợp nhất. Trả về mỗi truyện trên 1 dòng, chỉ bao gồm tên truyện.");
        return prompt.toString();
    }
    

    private List<String> parseAiResponse(String aiResponse) {
        if (aiResponse == null || aiResponse.isBlank()) {
            return Collections.emptyList();
        }

        return Arrays.stream(aiResponse.split("\n"))
                .map(line -> line.replaceAll("^[-•\\d.\\s]+", "").trim()) // Xóa ký tự đầu dòng như "1. ", "- "
                .filter(title -> !title.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }
}
