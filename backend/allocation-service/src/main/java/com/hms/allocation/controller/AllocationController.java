package com.hms.allocation.controller;
import com.hms.allocation.dto.*;
import com.hms.allocation.service.AllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/allocations") @RequiredArgsConstructor
public class AllocationController {
    private final AllocationService allocationService;

    @PostMapping public ResponseEntity<ApiResponse<AllocationDto>> allocate(@RequestBody AllocationDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Student allocated", allocationService.allocate(dto)));
    }
    @PutMapping("/{id}/vacate") public ResponseEntity<ApiResponse<AllocationDto>> vacate(
            @PathVariable Long id, @RequestParam(required=false) String remarks) {
        return ResponseEntity.ok(ApiResponse.success("Student vacated", allocationService.vacate(id, remarks)));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<AllocationDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Allocation found", allocationService.getAllocationById(id)));
    }
    @GetMapping("/student/{studentId}/active") public ResponseEntity<ApiResponse<AllocationDto>> getActiveByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Active allocation found", allocationService.getActiveAllocationByStudent(studentId)));
    }
    @GetMapping("/hostel/{hostelId}") public ResponseEntity<ApiResponse<Page<AllocationDto>>> getByHostel(
            @PathVariable Long hostelId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Allocations retrieved", allocationService.getAllocationsByHostel(hostelId, page, size)));
    }
    @GetMapping("/room/{roomId}") public ResponseEntity<ApiResponse<List<AllocationDto>>> getByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(ApiResponse.success("Room allocations retrieved", allocationService.getAllocationsByRoom(roomId)));
    }
}
