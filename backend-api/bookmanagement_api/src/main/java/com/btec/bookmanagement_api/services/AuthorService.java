package com.btec.bookmanagement_api.services;

import com.btec.bookmanagement_api.entities.Author;
import com.btec.bookmanagement_api.repositories.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorService {
    @Autowired
    private AuthorRepository authorRepository;

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Optional<Author> getAuthorById(String id) {
        return authorRepository.findById(id);
    }

    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    public Author updateAuthor(String id, Author authorDetails) {
        return authorRepository.findById(id).map(author -> {
            author.setName(authorDetails.getName());
            return authorRepository.save(author);
        }).orElse(null);
    }

    public void deleteAuthor(String id) {
        authorRepository.deleteById(id);
    }
}
