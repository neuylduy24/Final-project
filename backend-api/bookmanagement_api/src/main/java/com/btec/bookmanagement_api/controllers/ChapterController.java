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
    @Autowired
    private ChapterService chapterService;

    @GetMapping("/book/{bookId}")
    public List<Chapter> getChaptersByBookId(@PathVariable String bookId) {
        return chapterService.getChaptersByBookId(bookId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable String id) {
        return chapterService.getChapterById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/book/{bookId}/chapter/{chapterNumber}")
    public ResponseEntity<Chapter> getChapterByBookIdAndNumber(@PathVariable String bookId, @PathVariable int chapterNumber) {
        return chapterService.getChapterByBookIdAndNumber(bookId, chapterNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createChapter(@RequestBody Chapter chapter) {
        try {
            return ResponseEntity.ok(chapterService.createChapter(chapter));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateChapter(@PathVariable String id, @RequestBody Chapter chapterDetails) {
        try {
            return ResponseEntity.ok(chapterService.updateChapter(id, chapterDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable String id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }

//    // Lấy tất cả chương, sắp xếp theo ngày tạo giảm dần
//    @GetMapping("/sorted")
//    public List<Chapter> getAllChaptersSortedByDate() {
//        return chapterService.getAllChaptersSortedByDate();
//    }
//
//    // Lấy chương của một quyển sách cụ thể, sắp xếp theo ngày tạo giảm dần
//    @GetMapping("/book/{bookId}")
//    public List<Chapter> getChaptersByBookSortedByDate(@PathVariable String bookId) {
//        return chapterService.getChaptersByBookSortedByDate(bookId);
//    }
}
