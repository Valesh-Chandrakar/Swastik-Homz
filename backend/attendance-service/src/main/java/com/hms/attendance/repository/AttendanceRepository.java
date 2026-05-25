package com.hms.attendance.repository;
import com.hms.attendance.entity.Attendance;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.time.LocalDate;
import java.util.*;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentIdAndDateBetweenOrderByDateDesc(Long studentId, LocalDate from, LocalDate to);
    List<Attendance> findByHostelIdAndDate(Long hostelId, LocalDate date);
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    boolean existsByStudentIdAndDate(Long studentId, LocalDate date);
    Page<Attendance> findByHostelIdOrderByDateDesc(Long hostelId, Pageable pageable);
    long countByStudentIdAndStatusAndDateBetween(Long studentId, Attendance.AttendanceStatus status, LocalDate from, LocalDate to);
}
