package com.hms.complaint.repository;
import com.hms.complaint.entity.Complaint;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Page<Complaint> findByHostelId(Long hostelId, Pageable pageable);
    List<Complaint> findByHostelIdAndStatus(Long hostelId, Complaint.ComplaintStatus status);
    List<Complaint> findByAssignedTo(Long wardenId);
    long countByHostelIdAndStatus(Long hostelId, Complaint.ComplaintStatus status);
}
