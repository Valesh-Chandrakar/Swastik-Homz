package com.hms.notification.controller;
import com.hms.notification.dto.*;
import com.hms.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/notifications") @RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/send") public ResponseEntity<ApiResponse<Void>> send(@RequestBody CreateNotificationRequest req) {
        notificationService.sendNotification(req);
        return ResponseEntity.ok(ApiResponse.success("Notifications sent", null));
    }
    @GetMapping("/user/{userId}") public ResponseEntity<ApiResponse<Page<NotificationDto>>> getByUser(
            @PathVariable Long userId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notificationService.getNotificationsByUser(userId, page, size)));
    }
    @GetMapping("/user/{userId}/unread") public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Unread notifications", notificationService.getUnreadNotifications(userId)));
    }
    @GetMapping("/user/{userId}/count") public ResponseEntity<ApiResponse<Long>> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Unread count", notificationService.getUnreadCount(userId)));
    }
    @PutMapping("/{id}/read") public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
    @PutMapping("/user/{userId}/read-all") public ResponseEntity<ApiResponse<Void>> markAllRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All marked as read", null));
    }
}
