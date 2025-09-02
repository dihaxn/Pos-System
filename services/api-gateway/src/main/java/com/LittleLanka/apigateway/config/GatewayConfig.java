package com.LittleLanka.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("product-service", r -> r.path("/api/products/**")
                        .uri("lb://product-service"))
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://user-service"))
                .route("outlet-service", r -> r.path("/api/outlets/**")
                        .uri("lb://outlet-service"))
                .route("reporting-service", r -> r.path("/api/reports/**")
                        .uri("lb://reporting-service"))
                .build();
    }
}
