package com.hms.hostel.dto;
import com.hms.hostel.entity.Hostel;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HostelDto {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String email;
    private Long ownerId;
    private Integer totalFloors;
    private String description;
    private Hostel.HostelType type;
    private boolean active;
}
