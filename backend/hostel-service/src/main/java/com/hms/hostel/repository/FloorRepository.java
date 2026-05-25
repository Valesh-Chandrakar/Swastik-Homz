package com.hms.hostel.repository;
import com.hms.hostel.entity.Floor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findByHostelIdOrderByFloorNumber(Long hostelId);
    boolean existsByHostelIdAndFloorNumber(Long hostelId, Integer floorNumber);
}
