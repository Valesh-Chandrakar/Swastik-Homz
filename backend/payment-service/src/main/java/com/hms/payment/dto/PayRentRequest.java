package com.hms.payment.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PayRentRequest {
    private String transactionId;
    private LocalDate paidDate;
    private String remarks;
}
