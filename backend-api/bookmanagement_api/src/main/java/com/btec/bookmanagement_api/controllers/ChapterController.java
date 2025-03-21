package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.Chapter;
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

    @GetMapping
    public List<Chapter> getAllChapters() {
        return chapterService.getAllChapters();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chapter> getChapterById(@PathVariable String id) {
        Optional<Chapter> chapter = chapterService.getChapterById(id);
        return chapter.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/book/{bookId}")
    public List<Chapter> getChaptersByBookId(@PathVariable String bookId) {
        return chapterService.getChaptersByBookId(bookId);
    }

    @PostMapping
    public ResponseEntity<Chapter> createChapter(@RequestBody @Valid Chapter chapter) {
        try {
            return ResponseEntity.ok(chapterService.createChapter(chapter));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chapter> updateChapter(@PathVariable String id, @RequestBody Chapter updatedChapter) {
        try {
            return ResponseEntity.ok(chapterService.updateChapter(id, updatedChapter));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable String id) {
        chapterService.deleteChapter(id);
        return ResponseEntity.noContent().build();
    }

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    // Get all latest chapters
    @GetMapping("/latest")
    public List<Chapter> getLatestChapters() {
        return chapterService.getLatestChapters();
    }

    // Get only top 5 latest chapters
    @GetMapping("/latest/top5")
    public List<Chapter> getTop5LatestChapters() {
        return chapterService.getTop5LatestChapters();
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementChapterViews(@PathVariable String id) {
        chapterService.incrementChapterViews(id);
        return ResponseEntity.ok().build();
    }


    // API lấy tổng lượt xem của một sách
    @GetMapping("/book/{bookId}/views")
    public ResponseEntity<Integer> getTotalViewsByBookId(@PathVariable String bookId) {
        int totalViews = chapterService.getTotalViewsByBookId(bookId);
        return ResponseEntity.ok(totalViews);
    }
}
