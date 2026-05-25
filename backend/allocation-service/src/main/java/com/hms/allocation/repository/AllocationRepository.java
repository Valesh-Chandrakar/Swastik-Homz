package com.hms.allocation.repository;
import com.hms.allocation.entity.Allocation;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByStudentIdAndStatus(Long studentId, Allocation.AllocationStatus status);
    List<Allocation> findByHostelId(Long hostelId);
    List<Allocation> findByRoomId(Long roomId);
    List<Allocation> findByRoomIdAndBedNumber(Long roomId, Integer bedNumber);
    Page<Allocation> findByHostelId(Long hostelId, Pageable pageable);
    boolean existsByRoomIdAndBedNumberAndStatus(Long roomId, Integer bedNumber, Allocation.AllocationStatus status);
    long countByHostelIdAndStatus(Long hostelId, Allocation.AllocationStatus status);
}
