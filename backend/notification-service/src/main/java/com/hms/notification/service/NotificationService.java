package com.hms.notification.service;
import com.hms.notification.dto.*;
import com.hms.notification.entity.Notification;
import com.hms.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepo;

    public void sendNotification(CreateNotificationRequest req) {
        List<Notification> notifications = req.getUserIds().stream().map(userId ->
            Notification.builder().userId(userId).title(req.getTitle())
                .message(req.getMessage()).type(req.getType()).referenceId(req.getReferenceId())
                .isRead(false).build()
        ).collect(Collectors.toList());
        notificationRepo.saveAll(notifications);
    }

    public Page<NotificationDto> getNotificationsByUser(Long userId, int page, int size) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
            .map(this::map);
    }

    public List<NotificationDto> getUnreadNotifications(Long userId) {
        return notificationRepo.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
            .stream().map(this::map).collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepo.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        notificationRepo.save(n);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepo.markAllReadByUserId(userId);
    }

    private NotificationDto map(Notification n) {
        return NotificationDto.builder().id(n.getId()).userId(n.getUserId()).title(n.getTitle())
            .message(n.getMessage()).type(n.getType()).isRead(n.isRead())
            .referenceId(n.getReferenceId()).createdAt(n.getCreatedAt()).build();
    }
}
