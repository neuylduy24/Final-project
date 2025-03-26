package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.repositories.BookRepository;
import com.btec.bookmanagement_api.repositories.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;


import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    // ✅ Tạo chapter (chỉ khi Book tồn tại)
    public Chapter createChapter(Chapter chapter) {
        if (!bookRepository.existsById(chapter.getBookId())) {
            throw new RuntimeException("Book ID not found: " + chapter.getBookId());
        }
        return chapterRepository.save(chapter);
    }

    // ✅ Cập nhật chapter
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

    // ✅ Xóa chapter
    public void deleteChapter(String id) {
        chapterRepository.deleteById(id);
    }

    // ✅ Lấy danh sách chương theo Book ID
    public List<Chapter> getChaptersByBookId(String bookId) {
        return chapterRepository.findByBookId(bookId);
    }

    // ✅ Lấy tất cả chapter mới nhất
    public List<Chapter> getLatestChapters() {
        return chapterRepository.findAllByOrderByCreatedAtDesc();
    }

    // ✅ Lấy 5 chapter mới nhất
    public List<Chapter> getTop5LatestChapters() {
        return chapterRepository.findTop5ByOrderByCreatedAtDesc();
    }

    // ✅ Lấy chapter và tự động tăng số lượt xem
    public Optional<Chapter> getChapterById(String id) {
        Optional<Chapter> chapter = chapterRepository.findById(id);
        if (chapter.isPresent()) {
            incrementChapterViews(id); // 🔥 Tăng views khi có người đọc
        }
        return chapter;
    }

    // ✅ Cập nhật số lượt xem (tăng +1 mỗi lần đọc)
    public void incrementChapterViews(String id) {
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update().inc("views", 1);
        mongoTemplate.updateFirst(query, update, Chapter.class);
    }

    // ✅ Lấy tổng số lượt xem của tất cả chương trong sách
    public int getTotalViewsByBookId(String bookId) {
        return chapterRepository.findByBookId(bookId)
                .stream()
                .mapToInt(Chapter::getViews)
                .sum();
    }
}
