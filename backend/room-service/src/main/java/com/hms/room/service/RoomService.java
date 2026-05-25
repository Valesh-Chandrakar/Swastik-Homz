package com.hms.room.service;
import com.hms.room.dto.*;
import com.hms.room.entity.Room;
import com.hms.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepo;

    public RoomDto createRoom(RoomDto dto) {
        if (roomRepo.existsByHostelIdAndRoomNumber(dto.getHostelId(), dto.getRoomNumber()))
            throw new RuntimeException("Room number already exists in this hostel");
        Room r = Room.builder().hostelId(dto.getHostelId()).floorId(dto.getFloorId())
            .roomNumber(dto.getRoomNumber()).seaterType(dto.getSeaterType()).acType(dto.getAcType())
            .totalBeds(dto.getTotalBeds()).availableBeds(dto.getTotalBeds()).baseRent(dto.getBaseRent())
            .status(Room.RoomStatus.AVAILABLE).amenities(dto.getAmenities()).build();
        return map(roomRepo.save(r));
    }

    public RoomDto getRoomById(Long id) {
        return map(roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found")));
    }

    public Page<RoomDto> getRoomsByHostel(Long hostelId, int page, int size) {
        return roomRepo.findByHostelId(hostelId, PageRequest.of(page, size)).map(this::map);
    }

    public List<RoomDto> getAvailableRooms(Long hostelId) {
        return roomRepo.findByHostelIdAndStatus(hostelId, Room.RoomStatus.AVAILABLE)
            .stream().map(this::map).collect(Collectors.toList());
    }

    public RoomDto updateRoom(Long id, RoomDto dto) {
        Room r = roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        r.setRoomNumber(dto.getRoomNumber()); r.setSeaterType(dto.getSeaterType());
        r.setAcType(dto.getAcType()); r.setBaseRent(dto.getBaseRent());
        r.setAmenities(dto.getAmenities()); r.setStatus(dto.getStatus());
        return map(roomRepo.save(r));
    }

    public void updateBedAvailability(Long roomId, int change) {
        Room r = roomRepo.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        int newAvailable = r.getAvailableBeds() + change;
        if (newAvailable < 0) throw new RuntimeException("No beds available");
        r.setAvailableBeds(newAvailable);
        r.setStatus(newAvailable == 0 ? Room.RoomStatus.FULL : Room.RoomStatus.AVAILABLE);
        roomRepo.save(r);
    }

    public void deleteRoom(Long id) { roomRepo.deleteById(id); }

    private RoomDto map(Room r) {
        return RoomDto.builder().id(r.getId()).hostelId(r.getHostelId()).floorId(r.getFloorId())
            .roomNumber(r.getRoomNumber()).seaterType(r.getSeaterType()).acType(r.getAcType())
            .totalBeds(r.getTotalBeds()).availableBeds(r.getAvailableBeds()).baseRent(r.getBaseRent())
            .status(r.getStatus()).amenities(r.getAmenities()).build();
    }
}
