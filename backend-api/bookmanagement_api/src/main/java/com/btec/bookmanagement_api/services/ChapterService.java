package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;
    private BookRepository bookRepository;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Optional<Chapter> getChapterById(String id) {
        return chapterRepository.findById(id);
    }

    public List<Chapter> getChaptersByBookId(String bookId) {
        return chapterRepository.findByBookId(bookId);
    }

    public Chapter createChapter(Chapter chapter) {
        // Check if the book exists before saving the chapter
        if (!bookRepository.existsById(chapter.getBookId())) {
            throw new RuntimeException("Book ID not found: " + chapter.getBookId());
        }
        return chapterRepository.save(chapter);
    }

    public Chapter updateChapter(String id, Chapter updatedChapter) {
        return chapterRepository.findById(id)
                .map(chapter -> {
                    chapter.setChapterNumber(updatedChapter.getChapterNumber());
                    chapter.setTitle(updatedChapter.getTitle());
                    chapter.setContent(updatedChapter.getContent());
                    return chapterRepository.save(chapter);
                })
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
    }

    public void deleteChapter(String id) {
        chapterRepository.deleteById(id);
    }

    public ChapterService(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }

//    // Lấy tất cả chương, sắp xếp theo ngày tạo giảm dần
//    public List<Chapter> getAllChaptersSortedByDate() {
//        return chapterRepository.findAllByOrderByCreatedDesc();
//    }
//
//    // Lấy chương của một quyển sách cụ thể, sắp xếp theo ngày tạo
//    public List<Chapter> getChaptersByBookSortedByDate(String bookId) {
//        return chapterRepository.findByBookIdOrderByCreatedDesc(bookId);
//    }
}
