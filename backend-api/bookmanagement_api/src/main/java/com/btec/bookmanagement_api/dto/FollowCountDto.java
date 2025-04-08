package com.btec.bookmanagement_api.dto;

import lombok.Data;

@Data
public class FollowCountDto {
    // Giá trị _id trong aggregation sẽ là bookId
    private String id;
    private long totalFollows;

    public String getBookId() {
        return id;
    }
    public void setBookId(String id) {
        this.id = id;
    }
}
