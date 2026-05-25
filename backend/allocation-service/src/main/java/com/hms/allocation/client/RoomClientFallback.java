package com.hms.allocation.client;
import org.springframework.stereotype.Component;

@Component
public class RoomClientFallback implements RoomClient {
    @Override
    public void updateBedAvailability(Long id, int change) {
        // Circuit breaker fallback - log and continue
        System.err.println("Room service unavailable, bed count not updated for room: " + id);
    }
}
