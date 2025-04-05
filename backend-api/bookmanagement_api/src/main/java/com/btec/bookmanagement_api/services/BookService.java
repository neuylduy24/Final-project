package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Book;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

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

    public boolean updateBookImage(String bookId, byte[] imageData) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setImageData(imageData);
            bookRepository.save(book);
            return true;
        }
        return false;
    }

    public Optional<byte[]> getBookImage(String bookId) {
        return bookRepository.findById(bookId)
                .map(Book::getImageData);
    }
}
