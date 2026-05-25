package com.hms.visitor.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "visitors") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Visitor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long hostelId;
    @Column(nullable = false) private String visitorName;
    @Column(nullable = false) private String visitorPhone;
    private String visitorRelation;
    private String purpose;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private VisitorStatus status;
    private Long approvedBy;
    private String remarks;
    @CreationTimestamp private LocalDateTime createdAt;

    public enum VisitorStatus { PENDING, APPROVED, REJECTED, EXITED }
}
