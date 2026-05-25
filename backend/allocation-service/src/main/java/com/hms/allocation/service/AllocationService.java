package com.hms.allocation.service;
import com.hms.allocation.client.RoomClient;
import com.hms.allocation.dto.*;
import com.hms.allocation.entity.Allocation;
import com.hms.allocation.repository.AllocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AllocationService {
    private final AllocationRepository allocationRepo;
    private final RoomClient roomClient;

    @Transactional
    public AllocationDto allocate(AllocationDto dto) {
        if (allocationRepo.existsByRoomIdAndBedNumberAndStatus(dto.getRoomId(), dto.getBedNumber(), Allocation.AllocationStatus.ACTIVE))
            throw new RuntimeException("Bed is already occupied");
        allocationRepo.findByStudentIdAndStatus(dto.getStudentId(), Allocation.AllocationStatus.ACTIVE)
            .ifPresent(a -> { throw new RuntimeException("Student is already allocated to a room"); });

        Allocation a = Allocation.builder().studentId(dto.getStudentId()).roomId(dto.getRoomId())
            .hostelId(dto.getHostelId()).bedNumber(dto.getBedNumber())
            .allocationDate(dto.getAllocationDate() != null ? dto.getAllocationDate() : LocalDate.now())
            .status(Allocation.AllocationStatus.ACTIVE).remarks(dto.getRemarks()).build();

        Allocation saved = allocationRepo.save(a);
        roomClient.updateBedAvailability(dto.getRoomId(), -1);
        return map(saved);
    }

    @Transactional
    public AllocationDto vacate(Long allocationId, String remarks) {
        Allocation a = allocationRepo.findById(allocationId)
            .orElseThrow(() -> new RuntimeException("Allocation not found"));
        if (a.getStatus() != Allocation.AllocationStatus.ACTIVE)
            throw new RuntimeException("Allocation is not active");
        a.setStatus(Allocation.AllocationStatus.VACATED);
        a.setVacateDate(LocalDate.now());
        a.setRemarks(remarks);
        Allocation saved = allocationRepo.save(a);
        roomClient.updateBedAvailability(a.getRoomId(), 1);
        return map(saved);
    }

    public AllocationDto getAllocationById(Long id) {
        return map(allocationRepo.findById(id).orElseThrow(() -> new RuntimeException("Allocation not found")));
    }

    public AllocationDto getActiveAllocationByStudent(Long studentId) {
        return map(allocationRepo.findByStudentIdAndStatus(studentId, Allocation.AllocationStatus.ACTIVE)
            .orElseThrow(() -> new RuntimeException("No active allocation found for student")));
    }

    public Page<AllocationDto> getAllocationsByHostel(Long hostelId, int page, int size) {
        return allocationRepo.findByHostelId(hostelId, PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(this::map);
    }

    public List<AllocationDto> getAllocationsByRoom(Long roomId) {
        return allocationRepo.findByRoomId(roomId).stream().map(this::map).collect(Collectors.toList());
    }

    private AllocationDto map(Allocation a) {
        return AllocationDto.builder().id(a.getId()).studentId(a.getStudentId()).roomId(a.getRoomId())
            .hostelId(a.getHostelId()).bedNumber(a.getBedNumber()).allocationDate(a.getAllocationDate())
            .vacateDate(a.getVacateDate()).status(a.getStatus()).remarks(a.getRemarks()).build();
    }
}
