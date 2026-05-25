package com.hms.notification.dto;
import com.hms.notification.entity.Notification;
import lombok.Data;
import java.util.List;

@Data
public class CreateNotificationRequest {
    private List<Long> userIds;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private Long referenceId;
}
