package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BookRepository bookRepository;
    private final OpenAiService openAiService;
    private ReadingHistoryService readingHistoryService;

    public List<Book> recommendBooks(String userId) {
        // Lấy danh sách các truyện đã đọc của người dùng từ cơ sở dữ liệu
        List<Book> readBooks = getBooksUserRead(userId);
        if (readBooks.isEmpty()) {
            return List.of(); // Trả về danh sách rỗng nếu không có truyện đã đọc
        }

        // Tạo prompt cho OpenAI dựa trên danh sách truyện đã đọc
        String prompt = createPromptFromReadBooks(readBooks);

        // Gửi yêu cầu đến OpenAI để nhận gợi ý truyện
        String aiResponse = openAiService.getRecommendation(prompt);

        // Xử lý phản hồi từ OpenAI và lấy danh sách các truyện gợi ý
        List<String> recommendedBookTitles = parseAiResponse(aiResponse);

        // Truy vấn các truyện gợi ý từ cơ sở dữ liệu dựa trên tiêu đề
        return bookRepository.findByTitleIn(recommendedBookTitles);
    }

    private List<Book> getBooksUserRead(String email) {
        // Lấy danh sách lịch sử đọc của người dùng từ service ReadingHistoryService
        List<ReadingHistory> historyList = readingHistoryService.getUserReadingHistory(email);

        // Lấy danh sách các sách đã đọc từ lịch sử đọc
        return historyList.stream()
                .map(ReadingHistory::getBook)  // Trả về sách từ lịch sử đọc
                .collect(Collectors.toList()); // Chuyển thành danh sách các đối tượng Book
    }


    private String createPromptFromReadBooks(List<Book> readBooks) {
        // Tạo prompt dựa trên tiêu đề các truyện đã đọc
        String bookTitles = readBooks.stream()
                .map(Book::getTitle)
                .collect(Collectors.joining(", "));
        return "Dựa trên các truyện sau: " + bookTitles + ". Hãy gợi ý những truyện tương tự mà người dùng có thể thích.";
    }

    private List<String> parseAiResponse(String aiResponse) {
        // TODO: Xử lý phản hồi từ OpenAI và trích xuất danh sách tiêu đề truyện gợi ý
        return List.of(); // Tạm thời trả về danh sách rỗng
    }
}
