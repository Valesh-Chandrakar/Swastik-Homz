package com.hms.hostel.entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "hostels") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Hostel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String address;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String email;
    private Long ownerId;
    private Integer totalFloors;
    private String description;
    @Enumerated(EnumType.STRING) private HostelType type;
    private boolean active = true;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;

    public enum HostelType { BOYS, GIRLS, CO_ED }
}
