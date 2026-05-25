package com.hms.notification.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "notifications") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long userId;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT", nullable = false) private String message;
    @Enumerated(EnumType.STRING) private NotificationType type;
    private boolean isRead = false;
    private Long referenceId;
    @CreationTimestamp private LocalDateTime createdAt;

    public enum NotificationType { RENT_DUE, COMPLAINT_UPDATE, ALLOCATION_UPDATE, GENERAL, VISITOR_APPROVAL }
}
