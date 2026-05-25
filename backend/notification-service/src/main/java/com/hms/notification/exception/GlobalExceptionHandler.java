package com.hms.notification.exception;
import com.hms.notification.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handle(RuntimeException e) {
        return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    }
}
