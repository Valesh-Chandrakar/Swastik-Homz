package com.hms.attendance.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "attendance") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long hostelId;
    @Column(nullable = false) private Long wardenId;
    @Column(nullable = false) private LocalDate date;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private AttendanceStatus status;
    private String remarks;
    @CreationTimestamp private LocalDateTime createdAt;

    public enum AttendanceStatus { PRESENT, ABSENT, LEAVE, LATE }
}
