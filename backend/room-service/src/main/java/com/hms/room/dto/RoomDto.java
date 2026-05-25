package com.hms.room.dto;
import com.hms.room.entity.Room;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RoomDto {
    private Long id;
    private Long hostelId;
    private Long floorId;
    private String roomNumber;
    private Room.SeaterType seaterType;
    private Room.AcType acType;
    private Integer totalBeds;
    private Integer availableBeds;
    private BigDecimal baseRent;
    private Room.RoomStatus status;
    private String amenities;
}
