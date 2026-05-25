package com.hms.allocation.dto;
import com.hms.allocation.entity.Allocation;
import lombok.*;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AllocationDto {
    private Long id;
    private Long studentId;
    private Long roomId;
    private Long hostelId;
    private Integer bedNumber;
    private LocalDate allocationDate;
    private LocalDate vacateDate;
    private Allocation.AllocationStatus status;
    private String remarks;
}
