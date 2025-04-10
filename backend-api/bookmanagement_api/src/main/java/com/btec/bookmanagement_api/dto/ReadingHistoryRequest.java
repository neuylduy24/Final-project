package com.btec.bookmanagement_api.dto;

import lombok.Data;

@Data
public class ReadingHistoryRequest {
    private String email;
    private String userId;
    private String bookId;
    private String chapterId;
    private int progress;
    private long timeSpent;
}
