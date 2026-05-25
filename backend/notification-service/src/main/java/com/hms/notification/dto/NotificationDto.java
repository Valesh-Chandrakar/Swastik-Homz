package com.hms.notification.dto;
import com.hms.notification.entity.Notification;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private boolean isRead;
    private Long referenceId;
    private LocalDateTime createdAt;
}
