package com.hms.notification.client;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;

@Component
public class PaymentClientFallback implements PaymentClient {
    @Override
    public List<Long> getPendingStudentIds(Integer month, Integer year) {
        return Collections.emptyList();
    }
}
