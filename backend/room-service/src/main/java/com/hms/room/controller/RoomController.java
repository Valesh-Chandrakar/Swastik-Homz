package com.hms.room.controller;
import com.hms.room.dto.*;
import com.hms.room.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/rooms") @RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping public ResponseEntity<ApiResponse<RoomDto>> create(@RequestBody RoomDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Room created", roomService.createRoom(dto)));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<RoomDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Room found", roomService.getRoomById(id)));
    }
    @GetMapping("/hostel/{hostelId}") public ResponseEntity<ApiResponse<Page<RoomDto>>> getByHostel(
            @PathVariable Long hostelId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Rooms retrieved", roomService.getRoomsByHostel(hostelId, page, size)));
    }
    @GetMapping("/hostel/{hostelId}/available") public ResponseEntity<ApiResponse<List<RoomDto>>> getAvailable(@PathVariable Long hostelId) {
        return ResponseEntity.ok(ApiResponse.success("Available rooms", roomService.getAvailableRooms(hostelId)));
    }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<RoomDto>> update(@PathVariable Long id, @RequestBody RoomDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Room updated", roomService.updateRoom(id, dto)));
    }
    @PutMapping("/{id}/beds") public ResponseEntity<ApiResponse<Void>> updateBeds(
            @PathVariable Long id, @RequestParam int change) {
        roomService.updateBedAvailability(id, change);
        return ResponseEntity.ok(ApiResponse.success("Beds updated", null));
    }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success("Room deleted", null));
    }
}
