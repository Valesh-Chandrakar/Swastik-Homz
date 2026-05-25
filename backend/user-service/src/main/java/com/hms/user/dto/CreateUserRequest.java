package com.hms.user.dto;

import com.hms.user.entity.UserProfile;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotNull private Long authId;
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank @Email private String email;
    @NotBlank @Pattern(regexp = "^[0-9]{10}$") private String phone;
    private String address;
    private String city;
    private String state;
    @NotNull private UserProfile.Role role;
    private Long hostelId;
    private String emergencyContact;
    private String emergencyPhone;
}
