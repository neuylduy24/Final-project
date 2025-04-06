package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.MessageDigest;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {
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

    public List<Book> searchBooksByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Book> getBooksByAuthorId(String authorId) {
        return bookRepository.findByAuthorId(authorId);
    }

    public List<Book> getBooksSortedByCreatedDateDesc() {
        return bookRepository.findAllByOrderByCreatedAtDesc();
    }

    public Book createBook(Book book) {
        if (bookRepository.findByTitle(book.getTitle()).isPresent()) {
            throw new RuntimeException("Book with title '" + book.getTitle() + "' already exists!");
        }
        return bookRepository.save(book);
    }

    public Book updateBook(String id, Book bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            book.setAuthorId(bookDetails.getAuthorId());
            book.setImage(bookDetails.getImage());
            book.setDescription(bookDetails.getDescription());
            book.setChapters(bookDetails.getChapters());
            book.setCategories(bookDetails.getCategories());
            book.setViews(bookDetails.getViews());
            return bookRepository.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found with id " + id));
    }

    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }

    // Phương thức cập nhật ảnh cho sách và kiểm tra trùng lặp
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
    public String calculateImageHash(byte[] imageData) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(imageData);
        return Base64.getEncoder().encodeToString(hash);
    }

    public Optional<byte[]> getBookImage(String bookId) {
        return bookRepository.findById(bookId)
                .map(Book::getImageData);
    }
}
