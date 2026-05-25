package com.hms.notification.scheduler;

import com.hms.notification.client.PaymentClient;
import com.hms.notification.dto.CreateNotificationRequest;
import com.hms.notification.entity.Notification;
import com.hms.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component @RequiredArgsConstructor @Slf4j
public class RentReminderScheduler {
    private final NotificationService notificationService;
    private final PaymentClient paymentClient;

    @Value("${scheduler.rent-reminder.days-before:5}")
    private int daysBefore;

    @Scheduled(cron = "${scheduler.rent-reminder.cron:0 0 9 * * ?}")
    public void sendRentReminders() {
        log.info("Running rent reminder scheduler");
        LocalDate today = LocalDate.now();
        LocalDate reminderDate = today.plusDays(daysBefore);
        int month = reminderDate.getMonthValue();
        int year = reminderDate.getYear();

        try {
            List<Long> pendingStudentIds = paymentClient.getPendingStudentIds(month, year);
            if (pendingStudentIds != null && !pendingStudentIds.isEmpty()) {
                CreateNotificationRequest req = new CreateNotificationRequest();
                req.setUserIds(pendingStudentIds);
                req.setTitle("Rent Due Reminder");
                req.setMessage("Your rent for " + month + "/" + year + " is due on 5th of this month. Please pay to avoid late fees.");
                req.setType(Notification.NotificationType.RENT_DUE);
                notificationService.sendNotification(req);
                log.info("Sent rent reminders to {} students", pendingStudentIds.size());
            }
        } catch (Exception e) {
            log.error("Failed to send rent reminders: {}", e.getMessage());
        }
    }
}
