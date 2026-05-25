package com.hms.hostel.controller;
import com.hms.hostel.dto.*;
import com.hms.hostel.service.HostelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/hostels") @RequiredArgsConstructor
public class HostelController {
    private final HostelService hostelService;

    @PostMapping public ResponseEntity<ApiResponse<HostelDto>> create(@RequestBody HostelDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Hostel created", hostelService.createHostel(dto)));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<HostelDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Hostel found", hostelService.getHostelById(id)));
    }
    @GetMapping public ResponseEntity<ApiResponse<Page<HostelDto>>> getAll(
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size,
            @RequestParam(required=false) String search) {
        return ResponseEntity.ok(ApiResponse.success("Hostels retrieved", hostelService.getAllHostels(page, size, search)));
    }
    @GetMapping("/owner/{ownerId}") public ResponseEntity<ApiResponse<List<HostelDto>>> getByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(ApiResponse.success("Hostels retrieved", hostelService.getHostelsByOwner(ownerId)));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<HostelDto>> update(@PathVariable Long id, @RequestBody HostelDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Hostel updated", hostelService.updateHostel(id, dto)));
    }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        hostelService.deleteHostel(id);
        return ResponseEntity.ok(ApiResponse.success("Hostel deleted", null));
    }
    @PostMapping("/{hostelId}/floors") public ResponseEntity<ApiResponse<FloorDto>> addFloor(@PathVariable Long hostelId, @RequestBody FloorDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Floor added", hostelService.addFloor(hostelId, dto)));
    }
    @GetMapping("/{hostelId}/floors") public ResponseEntity<ApiResponse<List<FloorDto>>> getFloors(@PathVariable Long hostelId) {
        return ResponseEntity.ok(ApiResponse.success("Floors retrieved", hostelService.getFloorsByHostel(hostelId)));
    }
}
