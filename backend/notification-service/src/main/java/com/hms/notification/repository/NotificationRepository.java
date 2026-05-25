package com.hms.notification.repository;
import com.hms.notification.entity.Notification;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
    @Modifying @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId")
    void markAllReadByUserId(Long userId);
}
