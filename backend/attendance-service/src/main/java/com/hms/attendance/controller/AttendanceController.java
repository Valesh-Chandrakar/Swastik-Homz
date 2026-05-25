package com.hms.attendance.controller;
import com.hms.attendance.dto.*;
import com.hms.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController @RequestMapping("/api/attendance") @RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping public ResponseEntity<ApiResponse<AttendanceDto>> mark(@RequestBody AttendanceDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Attendance marked", attendanceService.markAttendance(dto)));
    }
    @PostMapping("/bulk") public ResponseEntity<ApiResponse<List<AttendanceDto>>> markBulk(@RequestBody BulkAttendanceRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Bulk attendance marked", attendanceService.markBulkAttendance(req)));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<AttendanceDto>> update(@PathVariable Long id, @RequestBody AttendanceDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Attendance updated", attendanceService.updateAttendance(id, dto)));
    }
    @GetMapping("/student/{studentId}") public ResponseEntity<ApiResponse<List<AttendanceDto>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved", attendanceService.getStudentAttendance(studentId, from, to)));
    }
    @GetMapping("/hostel/{hostelId}/date/{date}") public ResponseEntity<ApiResponse<List<AttendanceDto>>> getByDate(
            @PathVariable Long hostelId, @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved", attendanceService.getHostelAttendanceByDate(hostelId, date)));
    }
    @GetMapping("/hostel/{hostelId}") public ResponseEntity<ApiResponse<Page<AttendanceDto>>> getByHostel(
            @PathVariable Long hostelId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved", attendanceService.getHostelAttendance(hostelId, page, size)));
    }
    @GetMapping("/student/{studentId}/stats") public ResponseEntity<ApiResponse<Map<String, Long>>> getStats(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.success("Attendance stats", attendanceService.getAttendanceStats(studentId, from, to)));
    }
}
