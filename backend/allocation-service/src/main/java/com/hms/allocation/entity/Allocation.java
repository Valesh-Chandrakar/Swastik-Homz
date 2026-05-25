package com.hms.allocation.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "allocations") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Allocation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long roomId;
    @Column(nullable = false) private Long hostelId;
    @Column(nullable = false) private Integer bedNumber;
    @Column(nullable = false) private LocalDate allocationDate;
    private LocalDate vacateDate;
    @Enumerated(EnumType.STRING) private AllocationStatus status;
    private String remarks;
    @CreationTimestamp private LocalDateTime createdAt;

    public enum AllocationStatus { ACTIVE, VACATED, PENDING }
}
