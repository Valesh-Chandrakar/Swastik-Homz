package com.hms.user.service;

import com.hms.user.dto.*;
import com.hms.user.entity.UserProfile;
import com.hms.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileDto createUser(CreateUserRequest request) {
        if (userProfileRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");
        if (userProfileRepository.existsByPhone(request.getPhone()))
            throw new RuntimeException("Phone already exists");

        UserProfile profile = UserProfile.builder()
            .authId(request.getAuthId())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .address(request.getAddress())
            .city(request.getCity())
            .state(request.getState())
            .role(request.getRole())
            .hostelId(request.getHostelId())
            .emergencyContact(request.getEmergencyContact())
            .emergencyPhone(request.getEmergencyPhone())
            .build();

        return mapToDto(userProfileRepository.save(profile));
    }

    public UserProfileDto getUserById(Long id) {
        return mapToDto(userProfileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found")));
    }

    public UserProfileDto getUserByAuthId(Long authId) {
        return mapToDto(userProfileRepository.findByAuthId(authId)
            .orElseThrow(() -> new RuntimeException("User profile not found")));
    }

    public Page<UserProfileDto> getAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search != null && !search.isEmpty()) {
            return userProfileRepository.searchUsers(search, pageable).map(this::mapToDto);
        }
        return userProfileRepository.findAll(pageable).map(this::mapToDto);
    }

    public List<UserProfileDto> getUsersByHostel(Long hostelId) {
        return userProfileRepository.findByHostelId(hostelId).stream()
            .map(this::mapToDto).collect(Collectors.toList());
    }

    public UserProfileDto updateUser(Long id, CreateUserRequest request) {
        UserProfile profile = userProfileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setHostelId(request.getHostelId());
        profile.setEmergencyContact(request.getEmergencyContact());
        profile.setEmergencyPhone(request.getEmergencyPhone());
        return mapToDto(userProfileRepository.save(profile));
    }

    public String uploadIdProof(Long userId, MultipartFile file, String idProofType) throws IOException {
        UserProfile profile = userProfileRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Path uploadDir = Paths.get("uploads/id-proofs");
        Files.createDirectories(uploadDir);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        profile.setIdProofUrl("/uploads/id-proofs/" + filename);
        profile.setIdProofType(idProofType);
        userProfileRepository.save(profile);
        return "/uploads/id-proofs/" + filename;
    }

    public void deleteUser(Long id) {
        userProfileRepository.deleteById(id);
    }

    private UserProfileDto mapToDto(UserProfile p) {
        return UserProfileDto.builder()
            .id(p.getId()).authId(p.getAuthId())
            .firstName(p.getFirstName()).lastName(p.getLastName())
            .email(p.getEmail()).phone(p.getPhone())
            .address(p.getAddress()).city(p.getCity()).state(p.getState())
            .role(p.getRole()).hostelId(p.getHostelId())
            .idProofType(p.getIdProofType()).idProofUrl(p.getIdProofUrl())
            .profileImageUrl(p.getProfileImageUrl())
            .emergencyContact(p.getEmergencyContact()).emergencyPhone(p.getEmergencyPhone())
            .build();
    }
}
