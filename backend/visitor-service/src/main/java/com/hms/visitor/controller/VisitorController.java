package com.hms.visitor.controller;
import com.hms.visitor.dto.*;
import com.hms.visitor.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/visitors") @RequiredArgsConstructor
public class VisitorController {
    private final VisitorService visitorService;

    @PostMapping public ResponseEntity<ApiResponse<VisitorDto>> register(@RequestBody VisitorDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Visitor registered", visitorService.registerVisitor(dto)));
    }
    @PutMapping("/{id}/approve") public ResponseEntity<ApiResponse<VisitorDto>> approve(
            @PathVariable Long id, @RequestParam Long approvedBy) {
        return ResponseEntity.ok(ApiResponse.success("Visitor approved", visitorService.approveVisitor(id, approvedBy)));
    }
    @PutMapping("/{id}/reject") public ResponseEntity<ApiResponse<VisitorDto>> reject(
            @PathVariable Long id, @RequestParam Long approvedBy, @RequestParam(required=false) String remarks) {
        return ResponseEntity.ok(ApiResponse.success("Visitor rejected", visitorService.rejectVisitor(id, approvedBy, remarks)));
    }
    @PutMapping("/{id}/exit") public ResponseEntity<ApiResponse<VisitorDto>> exit(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Visitor exited", visitorService.markExit(id)));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<VisitorDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Visitor found", visitorService.getById(id)));
    }
    @GetMapping("/student/{studentId}") public ResponseEntity<ApiResponse<List<VisitorDto>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Visitors retrieved", visitorService.getByStudent(studentId)));
    }
    @GetMapping("/hostel/{hostelId}") public ResponseEntity<ApiResponse<Page<VisitorDto>>> getByHostel(
            @PathVariable Long hostelId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Visitors retrieved", visitorService.getByHostel(hostelId, page, size)));
    }
    @GetMapping("/hostel/{hostelId}/pending") public ResponseEntity<ApiResponse<List<VisitorDto>>> getPending(@PathVariable Long hostelId) {
        return ResponseEntity.ok(ApiResponse.success("Pending visitors", visitorService.getPendingVisitors(hostelId)));
    }
}
