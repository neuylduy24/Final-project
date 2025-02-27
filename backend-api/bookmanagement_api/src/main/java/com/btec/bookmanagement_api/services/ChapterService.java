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
                    chapter.setImages(updatedChapter.getImages());
                    chapter.setContent(updatedChapter.getContent());
                    chapter.setCreatedAt(updatedChapter.getCreatedAt());
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

  // Get all chapters sorted by createdAt (latest first)
    public List<Chapter> getLatestChapters() {
        return chapterRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get only the latest 5 chapters
    public List<Chapter> getTop5LatestChapters() {
        return chapterRepository.findTop5ByOrderByCreatedAtDesc();
    }
}
