package com.hms.allocation.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "room-service", fallback = RoomClientFallback.class)
public interface RoomClient {
    @PutMapping("/api/rooms/{id}/beds")
    void updateBedAvailability(@PathVariable Long id, @RequestParam int change);
}
