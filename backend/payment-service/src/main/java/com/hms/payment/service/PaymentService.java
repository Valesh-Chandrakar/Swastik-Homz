package com.hms.payment.service;
import com.hms.payment.dto.*;
import com.hms.payment.entity.Payment;
import com.hms.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepo;

    @Value("${electricity.rate-per-unit:8.0}")
    private double defaultElectricityRate;

    public PaymentDto createMonthlyPayment(PaymentDto dto) {
        paymentRepo.findByStudentIdAndMonthAndYear(dto.getStudentId(), dto.getMonth(), dto.getYear())
            .ifPresent(p -> { throw new RuntimeException("Payment record already exists for this month"); });

        Payment p = Payment.builder()
            .studentId(dto.getStudentId()).allocationId(dto.getAllocationId())
            .hostelId(dto.getHostelId()).roomId(dto.getRoomId())
            .month(dto.getMonth()).year(dto.getYear())
            .baseRent(dto.getBaseRent()).electricityUnits(0.0)
            .electricityRate(BigDecimal.valueOf(defaultElectricityRate))
            .electricityAmount(BigDecimal.ZERO)
            .totalAmount(dto.getBaseRent())
            .status(Payment.PaymentStatus.PENDING)
            .dueDate(LocalDate.of(dto.getYear(), dto.getMonth(), 5))
            .build();
        return map(paymentRepo.save(p));
    }

    public PaymentDto addElectricityBill(Long paymentId, ElectricityBillRequest req) {
        Payment p = paymentRepo.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        BigDecimal rate = req.getRatePerUnit() != null ? req.getRatePerUnit() : BigDecimal.valueOf(defaultElectricityRate);
        BigDecimal elecAmount = rate.multiply(BigDecimal.valueOf(req.getUnits()));
        p.setElectricityUnits(req.getUnits());
        p.setElectricityRate(rate);
        p.setElectricityAmount(elecAmount);
        p.setTotalAmount(p.getBaseRent().add(elecAmount));
        return map(paymentRepo.save(p));
    }

    public PaymentDto markAsPaid(Long paymentId, PayRentRequest req) {
        Payment p = paymentRepo.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
        p.setStatus(Payment.PaymentStatus.PAID);
        p.setPaidDate(req.getPaidDate() != null ? req.getPaidDate() : LocalDate.now());
        p.setTransactionId(req.getTransactionId());
        p.setRemarks(req.getRemarks());
        return map(paymentRepo.save(p));
    }

    public List<PaymentDto> getPaymentsByStudent(Long studentId) {
        return paymentRepo.findByStudentIdOrderByYearDescMonthDesc(studentId)
            .stream().map(this::map).collect(Collectors.toList());
    }

    public Page<PaymentDto> getPaymentsByHostel(Long hostelId, int page, int size) {
        return paymentRepo.findByHostelId(hostelId, PageRequest.of(page, size, Sort.by("year").descending().and(Sort.by("month").descending())))
            .map(this::map);
    }

    public List<PaymentDto> getPendingPayments(Long hostelId, Integer month, Integer year) {
        return paymentRepo.findByHostelIdAndMonthAndYear(hostelId, month, year)
            .stream().filter(p -> p.getStatus() == Payment.PaymentStatus.PENDING || p.getStatus() == Payment.PaymentStatus.OVERDUE)
            .map(this::map).collect(Collectors.toList());
    }

    public PaymentDto getPaymentById(Long id) {
        return map(paymentRepo.findById(id).orElseThrow(() -> new RuntimeException("Payment not found")));
    }

    private PaymentDto map(Payment p) {
        return PaymentDto.builder().id(p.getId()).studentId(p.getStudentId()).allocationId(p.getAllocationId())
            .hostelId(p.getHostelId()).roomId(p.getRoomId()).month(p.getMonth()).year(p.getYear())
            .baseRent(p.getBaseRent()).electricityUnits(p.getElectricityUnits()).electricityRate(p.getElectricityRate())
            .electricityAmount(p.getElectricityAmount()).totalAmount(p.getTotalAmount())
            .status(p.getStatus()).dueDate(p.getDueDate()).paidDate(p.getPaidDate())
            .transactionId(p.getTransactionId()).remarks(p.getRemarks()).build();
    }
}
