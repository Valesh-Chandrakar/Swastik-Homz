package com.hms.user.dto;

import com.hms.user.entity.UserProfile;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private Long authId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private UserProfile.Role role;
    private Long hostelId;
    private String idProofType;
    private String idProofUrl;
    private String profileImageUrl;
    private String emergencyContact;
    private String emergencyPhone;
}
