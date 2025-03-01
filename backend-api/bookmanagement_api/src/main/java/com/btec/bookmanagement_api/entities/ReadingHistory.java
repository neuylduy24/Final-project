package com.btec.bookmanagement_api.entities;

import jakarta.persistence.Entity;
import lombok.*;

import java.time.Instant;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ReadingHistory {
    private String bookId;     // ID sách
    private int progress;      // Tiến độ đọc (0-100%)
    private long timeSpent;    // Tổng thời gian đọc (tính bằng giây)
    private Instant lastReadAt; // Lần cuối đọc sách
}
