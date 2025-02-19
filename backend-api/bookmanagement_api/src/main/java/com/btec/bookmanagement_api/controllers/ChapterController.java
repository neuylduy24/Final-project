package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Chapter;
import com.btec.bookmanagement_api.services.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {
    private final ChapterService chapterService;

    @Autowired
    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    // ✅ Lấy danh sách chương của một sách
    @GetMapping("/book/{bookId}/all")
    public List<Chapter> getChaptersByBookId(@PathVariable String bookId) {
        return chapterService.getChaptersByBookId(bookId);
    }

    // ✅ Lấy chương theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable String id) {
        return chapterService.getChapterById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Lấy chương theo số thứ tự trong sách
    @GetMapping("/book/{bookId}/chapter/{chapterNumber}")
    public ResponseEntity<Chapter> getChapterByBookIdAndNumber(@PathVariable String bookId, @PathVariable int chapterNumber) {
        return chapterService.getChapterByBookIdAndNumber(bookId, chapterNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Thêm chương mới (Kiểm tra chương đã tồn tại hay chưa)
    @PostMapping
    public ResponseEntity<?> createChapter(@RequestBody Chapter chapter) {
        try {
            return ResponseEntity.ok(chapterService.createChapter(chapter));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Cập nhật chương
    @PutMapping("/{id}")
    public ResponseEntity<?> updateChapter(@PathVariable String id, @RequestBody Chapter chapterDetails) {
        try {
            return ResponseEntity.ok(chapterService.updateChapter(id, chapterDetails));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Xóa chương (Kiểm tra trước khi xóa)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable String id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Lấy tất cả chương, sắp xếp theo ngày tạo giảm dần
    @GetMapping("/sorted")
    public List<Chapter> getAllChaptersSortedByDate() {
        return chapterService.getAllChaptersSortedByDate();
    }

    // ✅ Lấy chương của một sách, sắp xếp theo ngày tạo giảm dần
    @GetMapping("/book/{bookId}/sorted")
    public List<Chapter> getChaptersByBookSortedByDate(@PathVariable String bookId) {
        return chapterService.getChaptersByBookSortedByDate(bookId);
    }
}
