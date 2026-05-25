package com.hms.visitor.service;
import com.hms.visitor.dto.*;
import com.hms.visitor.entity.Visitor;
import com.hms.visitor.repository.VisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class VisitorService {
    private final VisitorRepository visitorRepo;

    public VisitorDto registerVisitor(VisitorDto dto) {
        Visitor v = Visitor.builder().studentId(dto.getStudentId()).hostelId(dto.getHostelId())
            .visitorName(dto.getVisitorName()).visitorPhone(dto.getVisitorPhone())
            .visitorRelation(dto.getVisitorRelation()).purpose(dto.getPurpose())
            .status(Visitor.VisitorStatus.PENDING).build();
        return map(visitorRepo.save(v));
    }

    public VisitorDto approveVisitor(Long id, Long approvedBy) {
        Visitor v = visitorRepo.findById(id).orElseThrow(() -> new RuntimeException("Visitor not found"));
        v.setStatus(Visitor.VisitorStatus.APPROVED);
        v.setApprovedBy(approvedBy);
        v.setEntryTime(LocalDateTime.now());
        return map(visitorRepo.save(v));
    }

    public VisitorDto rejectVisitor(Long id, Long approvedBy, String remarks) {
        Visitor v = visitorRepo.findById(id).orElseThrow(() -> new RuntimeException("Visitor not found"));
        v.setStatus(Visitor.VisitorStatus.REJECTED);
        v.setApprovedBy(approvedBy);
        v.setRemarks(remarks);
        return map(visitorRepo.save(v));
    }

    public VisitorDto markExit(Long id) {
        Visitor v = visitorRepo.findById(id).orElseThrow(() -> new RuntimeException("Visitor not found"));
        v.setStatus(Visitor.VisitorStatus.EXITED);
        v.setExitTime(LocalDateTime.now());
        return map(visitorRepo.save(v));
    }

    public VisitorDto getById(Long id) {
        return map(visitorRepo.findById(id).orElseThrow(() -> new RuntimeException("Visitor not found")));
    }

    public List<VisitorDto> getByStudent(Long studentId) {
        return visitorRepo.findByStudentIdOrderByCreatedAtDesc(studentId).stream().map(this::map).collect(Collectors.toList());
    }

    public Page<VisitorDto> getByHostel(Long hostelId, int page, int size) {
        return visitorRepo.findByHostelIdOrderByCreatedAtDesc(hostelId, PageRequest.of(page, size)).map(this::map);
    }

    public List<VisitorDto> getPendingVisitors(Long hostelId) {
        return visitorRepo.findByHostelIdAndStatus(hostelId, Visitor.VisitorStatus.PENDING)
            .stream().map(this::map).collect(Collectors.toList());
    }

    private VisitorDto map(Visitor v) {
        return VisitorDto.builder().id(v.getId()).studentId(v.getStudentId()).hostelId(v.getHostelId())
            .visitorName(v.getVisitorName()).visitorPhone(v.getVisitorPhone()).visitorRelation(v.getVisitorRelation())
            .purpose(v.getPurpose()).entryTime(v.getEntryTime()).exitTime(v.getExitTime())
            .status(v.getStatus()).approvedBy(v.getApprovedBy()).remarks(v.getRemarks()).createdAt(v.getCreatedAt()).build();
    }
}
