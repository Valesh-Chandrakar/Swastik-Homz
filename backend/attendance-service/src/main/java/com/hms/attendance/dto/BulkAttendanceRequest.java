package com.hms.attendance.dto;
import com.hms.attendance.entity.Attendance;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BulkAttendanceRequest {
    private Long hostelId;
    private Long wardenId;
    private LocalDate date;
    private List<StudentAttendance> attendances;

    @Data
    public static class StudentAttendance {
        private Long studentId;
        private Attendance.AttendanceStatus status;
        private String remarks;
    }
}
