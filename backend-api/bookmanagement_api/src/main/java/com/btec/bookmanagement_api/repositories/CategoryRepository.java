package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Category;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    @Modifying
    @Transactional
    @Query("DELETE FROM Category c WHERE c.name = :name")
    void deleteByName(@PathVariable("name") String name);

}
