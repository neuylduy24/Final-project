package com.btec.bookmanagement_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongoAuditing
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class BookmanagementApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookmanagementApiApplication.class, args);
	}

}
