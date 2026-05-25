package com.hms.room.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "rooms") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private Long hostelId;
    private Long floorId;
    @Column(nullable = false) private String roomNumber;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private SeaterType seaterType;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private AcType acType;
    @Column(nullable = false) private Integer totalBeds;
    private Integer availableBeds;
    @Column(nullable = false) private BigDecimal baseRent;
    @Enumerated(EnumType.STRING) private RoomStatus status;
    private String amenities;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;

    public enum SeaterType { SINGLE, DOUBLE, QUAD }
    public enum AcType { AC, NON_AC }
    public enum RoomStatus { AVAILABLE, FULL, MAINTENANCE }
}
