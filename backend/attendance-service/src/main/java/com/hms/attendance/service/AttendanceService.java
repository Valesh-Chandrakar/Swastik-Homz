package com.hms.attendance.service;
import com.hms.attendance.dto.*;
import com.hms.attendance.entity.Attendance;
import com.hms.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AttendanceService {
    private final AttendanceRepository attendanceRepo;

    public AttendanceDto markAttendance(AttendanceDto dto) {
        if (attendanceRepo.existsByStudentIdAndDate(dto.getStudentId(), dto.getDate()))
            throw new RuntimeException("Attendance already marked for this student on " + dto.getDate());

        Attendance a = Attendance.builder().studentId(dto.getStudentId()).hostelId(dto.getHostelId())
            .wardenId(dto.getWardenId()).date(dto.getDate()).status(dto.getStatus()).remarks(dto.getRemarks()).build();
        return map(attendanceRepo.save(a));
    }

    public List<AttendanceDto> markBulkAttendance(BulkAttendanceRequest req) {
        return req.getAttendances().stream().map(sa -> {
            if (attendanceRepo.existsByStudentIdAndDate(sa.getStudentId(), req.getDate()))
                return attendanceRepo.findByStudentIdAndDate(sa.getStudentId(), req.getDate()).map(this::map).orElseThrow();
            Attendance a = Attendance.builder().studentId(sa.getStudentId()).hostelId(req.getHostelId())
                .wardenId(req.getWardenId()).date(req.getDate()).status(sa.getStatus()).remarks(sa.getRemarks()).build();
            return map(attendanceRepo.save(a));
        }).collect(Collectors.toList());
    }

    public AttendanceDto updateAttendance(Long id, AttendanceDto dto) {
        Attendance a = attendanceRepo.findById(id).orElseThrow(() -> new RuntimeException("Attendance not found"));
        a.setStatus(dto.getStatus());
        a.setRemarks(dto.getRemarks());
        return map(attendanceRepo.save(a));
    }

    public List<AttendanceDto> getStudentAttendance(Long studentId, LocalDate from, LocalDate to) {
        return attendanceRepo.findByStudentIdAndDateBetweenOrderByDateDesc(studentId, from, to)
            .stream().map(this::map).collect(Collectors.toList());
    }

    public List<AttendanceDto> getHostelAttendanceByDate(Long hostelId, LocalDate date) {
        return attendanceRepo.findByHostelIdAndDate(hostelId, date).stream().map(this::map).collect(Collectors.toList());
    }

    public Page<AttendanceDto> getHostelAttendance(Long hostelId, int page, int size) {
        return attendanceRepo.findByHostelIdOrderByDateDesc(hostelId, PageRequest.of(page, size)).map(this::map);
    }

    public Map<String, Long> getAttendanceStats(Long studentId, LocalDate from, LocalDate to) {
        return Map.of(
            "PRESENT", attendanceRepo.countByStudentIdAndStatusAndDateBetween(studentId, Attendance.AttendanceStatus.PRESENT, from, to),
            "ABSENT", attendanceRepo.countByStudentIdAndStatusAndDateBetween(studentId, Attendance.AttendanceStatus.ABSENT, from, to),
            "LEAVE", attendanceRepo.countByStudentIdAndStatusAndDateBetween(studentId, Attendance.AttendanceStatus.LEAVE, from, to)
        );
    }

    private AttendanceDto map(Attendance a) {
        return AttendanceDto.builder().id(a.getId()).studentId(a.getStudentId()).hostelId(a.getHostelId())
            .wardenId(a.getWardenId()).date(a.getDate()).status(a.getStatus()).remarks(a.getRemarks())
            .createdAt(a.getCreatedAt()).build();
    }
}
