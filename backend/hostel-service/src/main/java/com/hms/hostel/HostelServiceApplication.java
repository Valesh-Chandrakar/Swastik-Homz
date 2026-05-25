package com.hms.hostel;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class HostelServiceApplication {
    public static void main(String[] args) { SpringApplication.run(HostelServiceApplication.class, args); }
}
