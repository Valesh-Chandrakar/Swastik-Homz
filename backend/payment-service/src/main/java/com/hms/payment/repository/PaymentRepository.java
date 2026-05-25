package com.hms.payment.repository;
import com.hms.payment.entity.Payment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.math.BigDecimal;
import java.util.*;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    List<Payment> findByStudentIdOrderByYearDescMonthDesc(Long studentId);
    Optional<Payment> findByStudentIdAndMonthAndYear(Long studentId, Integer month, Integer year);
    List<Payment> findByHostelIdAndMonthAndYear(Long hostelId, Integer month, Integer year);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    Page<Payment> findByHostelId(Long hostelId, Pageable pageable);
    @Query("SELECT SUM(p.totalAmount) FROM Payment p WHERE p.hostelId = :hostelId AND p.status = 'PAID' AND p.year = :year AND p.month = :month")
    BigDecimal sumCollectedByHostelAndMonthYear(Long hostelId, Integer year, Integer month);
    long countByHostelIdAndStatus(Long hostelId, Payment.PaymentStatus status);
}
