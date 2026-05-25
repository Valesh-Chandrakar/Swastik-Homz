package com.hms.payment.dto;
import com.hms.payment.entity.Payment;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PaymentDto {
    private Long id;
    private Long studentId;
    private Long allocationId;
    private Long hostelId;
    private Long roomId;
    private Integer month;
    private Integer year;
    private BigDecimal baseRent;
    private Double electricityUnits;
    private BigDecimal electricityRate;
    private BigDecimal electricityAmount;
    private BigDecimal totalAmount;
    private Payment.PaymentStatus status;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String transactionId;
    private String remarks;
}
