package com.hms.payment.controller;
import com.hms.payment.dto.*;
import com.hms.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/payments") @RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping public ResponseEntity<ApiResponse<PaymentDto>> create(@RequestBody PaymentDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Payment created", paymentService.createMonthlyPayment(dto)));
    }
    @PutMapping("/{id}/electricity") public ResponseEntity<ApiResponse<PaymentDto>> addElectricity(
            @PathVariable Long id, @RequestBody ElectricityBillRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Electricity bill added", paymentService.addElectricityBill(id, req)));
    }
    @PutMapping("/{id}/pay") public ResponseEntity<ApiResponse<PaymentDto>> pay(
            @PathVariable Long id, @RequestBody PayRentRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Payment marked as paid", paymentService.markAsPaid(id, req)));
    }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<PaymentDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Payment found", paymentService.getPaymentById(id)));
    }
    @GetMapping("/student/{studentId}") public ResponseEntity<ApiResponse<List<PaymentDto>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", paymentService.getPaymentsByStudent(studentId)));
    }
    @GetMapping("/hostel/{hostelId}") public ResponseEntity<ApiResponse<Page<PaymentDto>>> getByHostel(
            @PathVariable Long hostelId, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", paymentService.getPaymentsByHostel(hostelId, page, size)));
    }
    @GetMapping("/hostel/{hostelId}/pending") public ResponseEntity<ApiResponse<List<PaymentDto>>> getPending(
            @PathVariable Long hostelId, @RequestParam Integer month, @RequestParam Integer year) {
        return ResponseEntity.ok(ApiResponse.success("Pending payments", paymentService.getPendingPayments(hostelId, month, year)));
    }
}
