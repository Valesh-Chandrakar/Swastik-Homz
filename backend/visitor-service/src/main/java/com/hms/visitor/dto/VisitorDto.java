package com.hms.visitor.dto;
import com.hms.visitor.entity.Visitor;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class VisitorDto {
    private Long id;
    private Long studentId;
    private Long hostelId;
    private String visitorName;
    private String visitorPhone;
    private String visitorRelation;
    private String purpose;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Visitor.VisitorStatus status;
    private Long approvedBy;
    private String remarks;
    private LocalDateTime createdAt;
}
