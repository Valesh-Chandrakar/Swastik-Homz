package com.hms.hostel.service;
import com.hms.hostel.dto.*;
import com.hms.hostel.entity.*;
import com.hms.hostel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class HostelService {
    private final HostelRepository hostelRepo;
    private final FloorRepository floorRepo;

    public HostelDto createHostel(HostelDto dto) {
        Hostel h = Hostel.builder().name(dto.getName()).address(dto.getAddress()).city(dto.getCity())
            .state(dto.getState()).pincode(dto.getPincode()).phone(dto.getPhone()).email(dto.getEmail())
            .ownerId(dto.getOwnerId()).totalFloors(dto.getTotalFloors()).description(dto.getDescription())
            .type(dto.getType()).active(true).build();
        return mapHostel(hostelRepo.save(h));
    }

    public HostelDto getHostelById(Long id) {
        return mapHostel(hostelRepo.findById(id).orElseThrow(() -> new RuntimeException("Hostel not found")));
    }

    public Page<HostelDto> getAllHostels(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search != null && !search.isEmpty())
            return hostelRepo.search(search, pageable).map(this::mapHostel);
        return hostelRepo.findAll(pageable).map(this::mapHostel);
    }

    public List<HostelDto> getHostelsByOwner(Long ownerId) {
        return hostelRepo.findByOwnerId(ownerId).stream().map(this::mapHostel).collect(Collectors.toList());
    }

    public HostelDto updateHostel(Long id, HostelDto dto) {
        Hostel h = hostelRepo.findById(id).orElseThrow(() -> new RuntimeException("Hostel not found"));
        h.setName(dto.getName()); h.setAddress(dto.getAddress()); h.setCity(dto.getCity());
        h.setState(dto.getState()); h.setPincode(dto.getPincode()); h.setPhone(dto.getPhone());
        h.setEmail(dto.getEmail()); h.setTotalFloors(dto.getTotalFloors()); h.setDescription(dto.getDescription());
        h.setType(dto.getType());
        return mapHostel(hostelRepo.save(h));
    }

    public void deleteHostel(Long id) { hostelRepo.deleteById(id); }

    public FloorDto addFloor(Long hostelId, FloorDto dto) {
        if (floorRepo.existsByHostelIdAndFloorNumber(hostelId, dto.getFloorNumber()))
            throw new RuntimeException("Floor already exists");
        Floor f = Floor.builder().hostelId(hostelId).floorNumber(dto.getFloorNumber())
            .description(dto.getDescription()).totalRooms(dto.getTotalRooms()).build();
        return mapFloor(floorRepo.save(f));
    }

    public List<FloorDto> getFloorsByHostel(Long hostelId) {
        return floorRepo.findByHostelIdOrderByFloorNumber(hostelId).stream().map(this::mapFloor).collect(Collectors.toList());
    }

    private HostelDto mapHostel(Hostel h) {
        return HostelDto.builder().id(h.getId()).name(h.getName()).address(h.getAddress()).city(h.getCity())
            .state(h.getState()).pincode(h.getPincode()).phone(h.getPhone()).email(h.getEmail())
            .ownerId(h.getOwnerId()).totalFloors(h.getTotalFloors()).description(h.getDescription())
            .type(h.getType()).active(h.isActive()).build();
    }

    private FloorDto mapFloor(Floor f) {
        return FloorDto.builder().id(f.getId()).hostelId(f.getHostelId()).floorNumber(f.getFloorNumber())
            .description(f.getDescription()).totalRooms(f.getTotalRooms()).build();
    }
}
