package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.btec.bookmanagement_api.dto.FollowCountDto;
import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BookService {


    private final MongoTemplate mongoTemplate;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }

    public Optional<Book> getBookByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

    public List<Book> getBooksByTitles(List<String> titles) {
        return bookRepository.findByTitleIn(titles);
    }


    public List<Book> searchBooksByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthor(author);
    }

    public List<Book> getBooksSortedByCreatedDateDesc() {
        return bookRepository.findAllByOrderByCreatedAtDesc();
    }

    public Book createBook(Book book) {
        // Kiểm tra trùng tiêu đề
        if (bookRepository.findByTitle(book.getTitle()).isPresent()) {
            throw new RuntimeException("Book with title '" + book.getTitle() + "' already exists!");
        }

        // Nếu có ảnh upload (dưới dạng byte[]), kiểm tra trùng hash
        if (book.getImageData() != null && book.getImageData().length > 0) {
            try {
                String imageHash = calculateImageHash(book.getImageData());
                Optional<Book> duplicate = bookRepository.findByImageHash(imageHash);
                if (duplicate.isPresent()) {
                    throw new RuntimeException("This image is already used by another book.");
                }
                book.setImageHash(imageHash);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Failed to hash image");
            }
        }

        return bookRepository.save(book);
    }


    public Book updateBook(String id, Book bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setImage(bookDetails.getImage());
            book.setDescription(bookDetails.getDescription());
            book.setCategories(bookDetails.getCategories());
            book.setImageData(bookDetails.getImageData());
            book.setViews(bookDetails.getViews());
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }

    public boolean updateBookImage(String bookId, byte[] imageData) {
        try {
            // Tính toán hash ảnh
            String imageHash = calculateImageHash(imageData);

            // Kiểm tra xem có sách nào đã sử dụng ảnh này chưa (trừ chính sách đang cập nhật)
            Optional<Book> duplicateImageBook = bookRepository.findByImageHash(imageHash)
                    .filter(book -> !book.getId().equals(bookId));

            if (duplicateImageBook.isPresent()) {
                return false; // Nếu có sách trùng ảnh, không cho phép cập nhật
            }

            Optional<Book> bookOpt = bookRepository.findById(bookId);
            if (bookOpt.isPresent()) {
                Book book = bookOpt.get();
                book.setImageData(imageData);
                book.setImageHash(imageHash); // Cập nhật hash ảnh vào sách
                bookRepository.save(book);
                return true;
            }
        } catch (Exception e) {
            // Nếu có lỗi xảy ra trong việc tính toán hash ảnh
            return false;
        }
        return false;
    }

    // Phương thức tính toán hash ảnh
    public String calculateImageHash(byte[] imageData) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(imageData);
        return Base64.getEncoder().encodeToString(hash);
    }

    public Optional<byte[]> getBookImage(String bookId) {
        return bookRepository.findById(bookId)
                .map(Book::getImageData);
    }
    public List<Book> getBooksByViews () {
        return bookRepository.findTop8ByOrderByViewsDesc();  // Lấy 8 sách có lượt xem nhiều nhất

    }

    // ✅ Lấy tất cả sách theo follow giảm dần
    @Cacheable(value = "bookFollowCounts", key = "'allBooksByFollow'")
    public List<Book> getBooksSortedByFollowCount() {
        Aggregation agg = newAggregation(
                group("bookId").count().as("totalFollows")
        );

        AggregationResults<FollowCountDto> results = mongoTemplate.aggregate(
                agg, "followbooks", FollowCountDto.class
        );

        Map<String, Long> followCountMap = results.getMappedResults().stream()
                .collect(Collectors.toMap(FollowCountDto::getBookId, FollowCountDto::getTotalFollows));

        List<Book> books = bookRepository.findAll();
        books.forEach(book -> {
            long count = followCountMap.getOrDefault(book.getId(), 0L);
            book.setTotalFollows(count);
        });

        return books.stream()
                .sorted((b1, b2) -> Long.compare(b2.getTotalFollows(), b1.getTotalFollows()))
                .collect(Collectors.toList());
    }

    // ✅ Lấy top 10 sách theo follow
    public List<Book> getTop10BooksByFollowCount() {
        return getBooksSortedByFollowCount().stream().limit(10).collect(Collectors.toList());
    }

    // 🕒 Xóa cache mỗi giờ
    @CacheEvict(value = "bookFollowCounts", allEntries = true)
    @Scheduled(fixedRate = 3600000)
    public void refreshBookFollowCache() {
        // xóa cache -> lần sau request sẽ tính lại
    }

    // Top 10 truyện có lượt view cao nhất
    public List<Book> getTop10BooksByViews() {
        return bookRepository.findTop10ByOrderByViewsDesc();
    }

    // Lấy toàn bộ truyện theo view giảm dần
    public List<Book> getAllBooksByViewsDesc() {
        return bookRepository.findAllByOrderByViewsDesc();
    }

}