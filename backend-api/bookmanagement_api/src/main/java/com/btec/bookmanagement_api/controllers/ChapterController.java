package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.services.BookService;
import com.btec.bookmanagement_api.services.ChapterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {
    @Autowired
    private ChapterService chapterService;
    private BookService bookService;

    // ✅ Lấy tất cả chapter
    @GetMapping
    public List<Chapter> getAllChapters() {
        return chapterService.getAllChapters();
    }

    // ✅ Lấy chapter theo ID và tự động tăng số lượt xem
    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable String id) {
        Optional<Chapter> chapter = chapterService.getChapterById(id);
        return chapter.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ API tăng view riêng (nếu không muốn tự động tăng trong GET)
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementChapterViews(@PathVariable String id) {
        chapterService.incrementChapterViews(id);
        return ResponseEntity.ok().build();
    }

    // ✅ Lấy chapter theo Book ID
    @GetMapping("/book/{bookId}")
    public List<Chapter> getChaptersByBookId(@PathVariable String bookId) {
        return chapterService.getChaptersByBookId(bookId);
    }

    // ✅ Tạo chapter
    @PostMapping
    public ResponseEntity<Chapter> createChapter(@RequestBody @Valid Chapter chapter) {
        try {
            return ResponseEntity.ok(chapterService.createChapter(chapter));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ✅ Cập nhật chapter
    @PutMapping("/{id}")
    public ResponseEntity<Chapter> updateChapter(@PathVariable String id, @RequestBody Chapter updatedChapter) {
        try {
            return ResponseEntity.ok(chapterService.updateChapter(id, updatedChapter));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Xóa chapter
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable String id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ API lấy tổng lượt xem của một sách
    @GetMapping("/book/{bookId}/views")
    public ResponseEntity<Integer> getTotalViewsByBookId(@PathVariable String bookId) {
        int totalViews = chapterService.getTotalViewsByBookId(bookId);
        return ResponseEntity.ok(totalViews);
    }

    @GetMapping("/book/{bookId}/count")
    public ResponseEntity<Long> countFollowers(@PathVariable String bookId) {
        long count = bookService.countViewsByBookId(bookId);
        return ResponseEntity.ok(count);
    }
}
