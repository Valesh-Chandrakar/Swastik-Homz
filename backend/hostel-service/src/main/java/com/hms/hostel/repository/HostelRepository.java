package com.hms.hostel.repository;
import com.hms.hostel.entity.Hostel;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface HostelRepository extends JpaRepository<Hostel, Long> {
    List<Hostel> findByOwnerId(Long ownerId);
    List<Hostel> findByActive(boolean active);
    Page<Hostel> findAll(Pageable pageable);
    @Query("SELECT h FROM Hostel h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(h.city) LIKE LOWER(CONCAT('%',:search,'%'))")
    Page<Hostel> search(String search, Pageable pageable);
}
