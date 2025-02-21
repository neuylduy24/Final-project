package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.repositories.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    public List<Chapter> getChaptersByBookId(String bookId) {
        return chapterRepository.findByBookId(bookId);
    }

    public Optional<Chapter> getChapterById(String id) {
        return chapterRepository.findById(id);
    }

    public Optional<Chapter> getChapterByBookIdAndNumber(String bookId, int chapterNumber) {
        return chapterRepository.findByBookIdAndChapterNumber(bookId, chapterNumber);
    }

    public Chapter createChapter(Chapter chapter) {
        if (chapterRepository.findByBookIdAndChapterNumber(chapter.getBookId(), chapter.getChapterNumber()).isPresent()) {
            throw new RuntimeException("Chapter number " + chapter.getChapterNumber() + " already exists for this book!");
        }
        return chapterRepository.save(chapter);
    }

    public Chapter updateChapter(String id, Chapter chapterDetails) {
        return chapterRepository.findById(id).map(chapter -> {
            chapter.setBookId(chapterDetails.getBookId());
            chapter.setChapterNumber(chapterDetails.getChapterNumber());
            chapter.setTitle(chapterDetails.getTitle());
            chapter.setContent(chapterDetails.getContent());
            chapter.setCreatedAt(chapterDetails.getCreatedAt()); // Fixed field name
            return chapterRepository.save(chapter);
        }).orElseThrow(() -> new RuntimeException("Chapter not found with id " + id));
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
