package com.hms.hostel.exception;
import com.hms.hostel.dto.ApiResponse;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handle(RuntimeException e) {
        return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    }
}
