package com.btec.bookmanagement_api.repositories;

import com.btec.bookmanagement_api.entities.Author;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends MongoRepository<Author, String> {
}
