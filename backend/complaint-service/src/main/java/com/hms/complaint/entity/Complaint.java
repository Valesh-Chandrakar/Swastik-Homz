package com.hms.complaint.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "complaints") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Complaint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long hostelId;
    private Long roomId;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Enumerated(EnumType.STRING) private ComplaintCategory category;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private ComplaintStatus status;
    private Long assignedTo;
    private String resolution;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public enum ComplaintCategory { MAINTENANCE, CLEANLINESS, NOISE, ELECTRICITY, PLUMBING, SECURITY, FOOD, OTHER }
    public enum ComplaintStatus { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
}
