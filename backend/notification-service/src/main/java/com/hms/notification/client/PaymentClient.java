package com.hms.notification.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "payment-service", fallback = PaymentClientFallback.class)
public interface PaymentClient {
    @GetMapping("/api/payments/pending-student-ids")
    List<Long> getPendingStudentIds(@RequestParam Integer month, @RequestParam Integer year);
}
