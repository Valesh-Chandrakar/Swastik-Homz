package com.hms.gateway.config;

import com.hms.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class GatewayConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public GatewayConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("auth-service", r -> r.path("/api/auth/**")
                .uri("lb://auth-service"))
            .route("user-service", r -> r.path("/api/users/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://user-service"))
            .route("hostel-service", r -> r.path("/api/hostels/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://hostel-service"))
            .route("room-service", r -> r.path("/api/rooms/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://room-service"))
            .route("allocation-service", r -> r.path("/api/allocations/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://allocation-service"))
            .route("payment-service", r -> r.path("/api/payments/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://payment-service"))
            .route("complaint-service", r -> r.path("/api/complaints/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://complaint-service"))
            .route("attendance-service", r -> r.path("/api/attendance/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://attendance-service"))
            .route("visitor-service", r -> r.path("/api/visitors/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://visitor-service"))
            .route("notification-service", r -> r.path("/api/notifications/**")
                .filters(f -> f.filter(jwtFilter.apply(new JwtAuthenticationFilter.Config())))
                .uri("lb://notification-service"))
            .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
