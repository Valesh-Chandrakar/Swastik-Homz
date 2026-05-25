package com.hms.payment.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "payments") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long allocationId;
    @Column(nullable = false) private Long hostelId;
    @Column(nullable = false) private Long roomId;
    @Column(nullable = false) private Integer month;
    @Column(nullable = false) private Integer year;
    @Column(nullable = false) private BigDecimal baseRent;
    private Double electricityUnits;
    private BigDecimal electricityRate;
    private BigDecimal electricityAmount;
    @Column(nullable = false) private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private PaymentStatus status;
    @Column(nullable = false) private LocalDate dueDate;
    private LocalDate paidDate;
    private String transactionId;
    private String remarks;
    @CreationTimestamp private LocalDateTime createdAt;

    public enum PaymentStatus { PENDING, PAID, OVERDUE, PARTIAL }
}
