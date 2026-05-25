package com.hms.visitor.repository;
import com.hms.visitor.entity.Visitor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Page<Visitor> findByHostelIdOrderByCreatedAtDesc(Long hostelId, Pageable pageable);
    List<Visitor> findByHostelIdAndStatus(Long hostelId, Visitor.VisitorStatus status);
    long countByHostelIdAndStatus(Long hostelId, Visitor.VisitorStatus status);
}
