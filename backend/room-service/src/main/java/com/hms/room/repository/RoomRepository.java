package com.hms.room.repository;
import com.hms.room.entity.Room;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHostelId(Long hostelId);
    List<Room> findByHostelIdAndSeaterType(Long hostelId, Room.SeaterType seaterType);
    List<Room> findByHostelIdAndAcType(Long hostelId, Room.AcType acType);
    List<Room> findByHostelIdAndStatus(Long hostelId, Room.RoomStatus status);
    Page<Room> findByHostelId(Long hostelId, Pageable pageable);
    boolean existsByHostelIdAndRoomNumber(Long hostelId, String roomNumber);
    long countByHostelIdAndStatus(Long hostelId, Room.RoomStatus status);
    @Query("SELECT SUM(r.availableBeds) FROM Room r WHERE r.hostelId = :hostelId")
    Integer sumAvailableBedsByHostelId(Long hostelId);
}
