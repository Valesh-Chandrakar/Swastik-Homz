package com.hms.hostel.dto;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FloorDto {
    private Long id;
    private Long hostelId;
    private Integer floorNumber;
    private String description;
    private Integer totalRooms;
}
