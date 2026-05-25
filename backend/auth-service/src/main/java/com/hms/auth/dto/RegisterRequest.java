package com.hms.auth.dto;

import com.hms.auth.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank @Size(min = 6)
    private String password;

    @NotNull
    private User.Role role;
}
