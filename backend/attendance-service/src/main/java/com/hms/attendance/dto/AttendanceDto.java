package com.hms.attendance.dto;
import com.hms.attendance.entity.Attendance;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AttendanceDto {
    private Long id;
    private Long studentId;
    private Long hostelId;
    private Long wardenId;
    private LocalDate date;
    private Attendance.AttendanceStatus status;
    private String remarks;
    private LocalDateTime createdAt;
}
