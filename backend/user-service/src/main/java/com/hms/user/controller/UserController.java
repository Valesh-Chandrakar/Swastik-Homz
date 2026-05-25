package com.hms.user.controller;

import com.hms.user.dto.*;
import com.hms.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserProfileDto>> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User created", userService.createUser(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User found", userService.getUserById(id)));
    }

    @GetMapping("/auth/{authId}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserByAuthId(@PathVariable Long authId) {
        return ResponseEntity.ok(ApiResponse.success("User found", userService.getUserByAuthId(authId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserProfileDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", userService.getAllUsers(page, size, search)));
    }

    @GetMapping("/hostel/{hostelId}")
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getUsersByHostel(@PathVariable Long hostelId) {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", userService.getUsersByHostel(hostelId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateUser(@PathVariable Long id, @Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User updated", userService.updateUser(id, request)));
    }

    @PostMapping("/{id}/id-proof")
    public ResponseEntity<ApiResponse<String>> uploadIdProof(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String idProofType) throws IOException {
        String url = userService.uploadIdProof(id, file, idProofType);
        return ResponseEntity.ok(ApiResponse.success("ID proof uploaded", url));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }
}
