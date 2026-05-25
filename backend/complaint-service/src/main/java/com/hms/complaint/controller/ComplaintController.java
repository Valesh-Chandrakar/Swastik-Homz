package com.hms.complaint.controller;
import com.hms.complaint.dto.*;
import com.hms.complaint.entity.Complaint;
import com.hms.complaint.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/complaints") @RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @PostMapping public ResponseEntity<ApiResponse<ComplaintDto>> raise(@RequestBody ComplaintDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Complaint raised", complaintService.raiseComplaint(dto)));
    }
    @PutMapping("/{id}/assign") public ResponseEntity<ApiResponse<ComplaintDto>> assign(
            @PathVariable Long id, @RequestParam Long wardenId) {
        return ResponseEntity.ok(ApiResponse.success("Complaint assigned", complaintService.assignComplaint(id, wardenId)));
    }
    @PutMapping("/{id}/resolve") public ResponseEntity<ApiResponse<ComplaintDto>> resolve(
            @PathVariable Long id, @RequestParam String resolution) {
        return ResponseEntity.ok(ApiResponse.success("Complaint resolved", complaintService.resolveComplaint(id, resolution)));
    }
    @PutMapping("/{id}/close") public ResponseEntity<ApiResponse<ComplaintDto>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Complaint closed", complaintService.closeComplaint(id)));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<ComplaintDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Complaint found", complaintService.getById(id)));
    }
    @GetMapping("/student/{studentId}") public ResponseEntity<ApiResponse<List<ComplaintDto>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Complaints retrieved", complaintService.getByStudent(studentId)));
    }
    @GetMapping("/hostel/{hostelId}") public ResponseEntity<ApiResponse<Page<ComplaintDto>>> getByHostel(
            @PathVariable Long hostelId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Complaints retrieved", complaintService.getByHostel(hostelId, page, size)));
    }
    @GetMapping("/warden/{wardenId}") public ResponseEntity<ApiResponse<List<ComplaintDto>>> getByWarden(@PathVariable Long wardenId) {
        return ResponseEntity.ok(ApiResponse.success("Assigned complaints", complaintService.getByWarden(wardenId)));
    }
    @GetMapping("/hostel/{hostelId}/status/{status}") public ResponseEntity<ApiResponse<List<ComplaintDto>>> getByStatus(
            @PathVariable Long hostelId, @PathVariable Complaint.ComplaintStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Complaints by status", complaintService.getByHostelAndStatus(hostelId, status)));
    }
}
