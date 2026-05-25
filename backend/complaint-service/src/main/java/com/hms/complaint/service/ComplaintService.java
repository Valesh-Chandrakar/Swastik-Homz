package com.hms.complaint.service;
import com.hms.complaint.dto.*;
import com.hms.complaint.entity.Complaint;
import com.hms.complaint.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepo;

    public ComplaintDto raiseComplaint(ComplaintDto dto) {
        Complaint c = Complaint.builder().studentId(dto.getStudentId()).hostelId(dto.getHostelId())
            .roomId(dto.getRoomId()).title(dto.getTitle()).description(dto.getDescription())
            .category(dto.getCategory()).status(Complaint.ComplaintStatus.OPEN).build();
        return map(complaintRepo.save(c));
    }

    public ComplaintDto assignComplaint(Long id, Long wardenId) {
        Complaint c = complaintRepo.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        c.setAssignedTo(wardenId);
        c.setStatus(Complaint.ComplaintStatus.IN_PROGRESS);
        return map(complaintRepo.save(c));
    }

    public ComplaintDto resolveComplaint(Long id, String resolution) {
        Complaint c = complaintRepo.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        c.setStatus(Complaint.ComplaintStatus.RESOLVED);
        c.setResolution(resolution);
        c.setResolvedAt(LocalDateTime.now());
        return map(complaintRepo.save(c));
    }

    public ComplaintDto closeComplaint(Long id) {
        Complaint c = complaintRepo.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        c.setStatus(Complaint.ComplaintStatus.CLOSED);
        return map(complaintRepo.save(c));
    }

    public ComplaintDto getById(Long id) {
        return map(complaintRepo.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found")));
    }

    public List<ComplaintDto> getByStudent(Long studentId) {
        return complaintRepo.findByStudentIdOrderByCreatedAtDesc(studentId).stream().map(this::map).collect(Collectors.toList());
    }

    public Page<ComplaintDto> getByHostel(Long hostelId, int page, int size) {
        return complaintRepo.findByHostelId(hostelId, PageRequest.of(page, size, Sort.by("createdAt").descending())).map(this::map);
    }

    public List<ComplaintDto> getByWarden(Long wardenId) {
        return complaintRepo.findByAssignedTo(wardenId).stream().map(this::map).collect(Collectors.toList());
    }

    public List<ComplaintDto> getByHostelAndStatus(Long hostelId, Complaint.ComplaintStatus status) {
        return complaintRepo.findByHostelIdAndStatus(hostelId, status).stream().map(this::map).collect(Collectors.toList());
    }

    private ComplaintDto map(Complaint c) {
        return ComplaintDto.builder().id(c.getId()).studentId(c.getStudentId()).hostelId(c.getHostelId())
            .roomId(c.getRoomId()).title(c.getTitle()).description(c.getDescription()).category(c.getCategory())
            .status(c.getStatus()).assignedTo(c.getAssignedTo()).resolution(c.getResolution())
            .createdAt(c.getCreatedAt()).resolvedAt(c.getResolvedAt()).build();
    }
}
