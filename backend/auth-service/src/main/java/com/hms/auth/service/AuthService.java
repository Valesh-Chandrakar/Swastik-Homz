package com.hms.auth.service;

import com.hms.auth.dto.*;
import com.hms.auth.entity.User;
import com.hms.auth.repository.UserRepository;
import com.hms.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isActive()) throw new RuntimeException("Account is deactivated");
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder()
            .token(token).type("Bearer").userId(user.getId())
            .email(user.getEmail()).role(user.getRole()).active(user.isActive())
            .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already registered");
        if (userRepository.existsByPhone(request.getPhone()))
            throw new RuntimeException("Phone number already registered");

        User user = User.builder()
            .email(request.getEmail())
            .phone(request.getPhone())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .active(true)
            .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return AuthResponse.builder()
            .token(token).type("Bearer").userId(user.getId())
            .email(user.getEmail()).role(user.getRole()).active(true)
            .build();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    public void activateUser(Long id) {
        User user = getUserById(id);
        user.setActive(true);
        userRepository.save(user);
    }

    public void changePassword(Long id, String oldPassword, String newPassword) {
        User user = getUserById(id);
        if (!passwordEncoder.matches(oldPassword, user.getPassword()))
            throw new RuntimeException("Current password is incorrect");
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
