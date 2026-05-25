package com.hms.payment.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ElectricityBillRequest {
    private Double units;
    private BigDecimal ratePerUnit;
}
