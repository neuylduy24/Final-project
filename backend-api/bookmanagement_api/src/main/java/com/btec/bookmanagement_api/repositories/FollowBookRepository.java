package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.FollowBook;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowBookRepository extends MongoRepository<FollowBook, String> {



    // Lấy danh sách theo dõi theo email người dùng

    List<FollowBook> findByEmail(String email);

    // Tìm theo email và bookId
    Optional<FollowBook> findByEmailAndBookId(String email, String bookId);

    // Kiểm tra xem người dùng đã theo dõi sách hay chưa
    boolean existsByEmailAndBookId(String email, String bookId);

    // Xóa bản ghi theo dõi theo email và bookId
    void deleteByEmailAndBookId(String email, String bookId);
}
