package com.campusmarketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private String fromUsername;
    private String toUsername;
    private LocalDateTime timestamp;
    private String content;
}
