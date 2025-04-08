package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.entities.ReadingHistory;
import com.btec.bookmanagement_api.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonalizedRecommendationService {

    private final BookRepository bookRepository;
    private final UserService userService;
    private final ReadingHistoryService readingHistoryService;

    public List<Book> recommendBooks(String email) {
        Set<String> allCategoryNames = new HashSet<>();

        // 🔹 Lấy thể loại từ sách yêu thích
        List<String> favoriteCategories = userService.getFavoriteCategories(email);
        allCategoryNames.addAll(favoriteCategories);

        // 🔹 Lấy thể loại từ lịch sử đọc
        List<ReadingHistory> readingHistory = readingHistoryService.getUserReadingHistory(email);

        List<String> historyCategories = readingHistory.stream()
                .map(ReadingHistory::getBookId)
                .filter(Objects::nonNull)
                .map(bookRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(Objects::nonNull)
                .flatMap(book -> book.getCategories().stream())
                .filter(Objects::nonNull)
                .map(c -> c.getName())
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        allCategoryNames.addAll(historyCategories);

        // 🔹 Lấy thể loại từ lịch sử tìm kiếm
        List<String> searchHistory = userService.getSearchHistory(email);
        List<Book> searchMatchedBooks = bookRepository.findByTitleIn(searchHistory);
        List<String> searchCategories = searchMatchedBooks.stream()
                .flatMap(book -> book.getCategories().stream())
                .map(c -> c.getName())
                .collect(Collectors.toList());
        allCategoryNames.addAll(searchCategories);

        // 🔸 Nếu không có dữ liệu thì trả về sách ngẫu nhiên
        if (allCategoryNames.isEmpty()) {
            return bookRepository.findRandomBooks(10);
        }

        // 🔸 Trả về truyện có cùng thể loại
        return bookRepository.findByCategoryNames(new ArrayList<>(allCategoryNames))
                .stream()
                .limit(10)
                .collect(Collectors.toList());
    }
}
