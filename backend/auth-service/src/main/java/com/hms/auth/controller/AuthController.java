package com.hms.auth.controller;

import com.hms.auth.dto.*;
import com.hms.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User found", authService.getUserById(id)));
    }

    @PutMapping("/user/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        authService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", null));
    }

    @PutMapping("/user/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activate(@PathVariable Long id) {
        authService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated", null));
    }
}
