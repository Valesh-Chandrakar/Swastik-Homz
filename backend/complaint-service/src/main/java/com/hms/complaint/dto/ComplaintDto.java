package com.hms.complaint.dto;
import com.hms.complaint.entity.Complaint;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplaintDto {
    private Long id;
    private Long studentId;
    private Long hostelId;
    private Long roomId;
    private String title;
    private String description;
    private Complaint.ComplaintCategory category;
    private Complaint.ComplaintStatus status;
    private Long assignedTo;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
