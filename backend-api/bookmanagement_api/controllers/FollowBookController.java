package com.btec.bookmanagement_api.controllers;

import com.btec.bookmanagement_api.entities.FollowBook;
import com.btec.bookmanagement_api.services.FollowBookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/follow-books")
public class FollowBookController {

    private final FollowBookService followBookService;

    public FollowBookController(FollowBookService followBookService) {
        this.followBookService = followBookService;
    }

    // Lấy tất cả sách đang theo dõi
    @GetMapping
    public ResponseEntity<List<FollowBook>> getAllFollowBooks() {
        List<FollowBook> followBooks = followBookService.getAllFollowBooks();
        return ResponseEntity.ok(followBooks);
    }



//    // Thay đổi từ userId sang email trong các endpoint
//    @GetMapping("/user/{email}")
//    public List<FollowBook> getFollowBooksByEmail(@PathVariable String email) {
//        return followBookService.getFollowBooksByEmail(email);
//    }


    // Lấy danh sách sách đang theo dõi theo email người dùng
    @GetMapping("/user/{email}")
    public ResponseEntity<List<FollowBook>> getFollowBooksByEmail(@PathVariable String email) {
        List<FollowBook> followBooks = followBookService.getFollowBooksByEmail(email);
        if (followBooks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(followBooks);
    }

    // Lấy thông tin theo dõi sách theo email và bookId

    @GetMapping("/user/{email}/book/{bookId}")
    public ResponseEntity<FollowBook> getFollowBookByEmailAndBook(@PathVariable String email, @PathVariable String bookId) {
        Optional<FollowBook> followBook = followBookService.getFollowBookByEmailAndBook(email, bookId);
        return followBook.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo một bản ghi theo dõi sách mới
    @PostMapping
    public ResponseEntity<FollowBook> createFollowBook(@RequestBody FollowBook followBook) {
        FollowBook createdFollowBook = followBookService.createFollowBook(followBook);
        return ResponseEntity.ok(createdFollowBook);
    }

    // Xóa theo dõi sách theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowBook(@PathVariable String id) {
        followBookService.deleteFollowBook(id);
        return ResponseEntity.noContent().build();
    }



    // Thay đổi từ userId sang email

    // Xóa theo dõi sách theo email và bookId

    @DeleteMapping("/user/{email}/book/{bookId}")
    public ResponseEntity<Void> deleteFollowBookByEmailAndBook(@PathVariable String email, @PathVariable String bookId) {
        followBookService.deleteFollowBookByEmailAndBook(email, bookId);
        return ResponseEntity.noContent().build();
    }
}
