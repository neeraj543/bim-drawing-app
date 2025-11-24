package com.bim.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to BIM Drawing Manager API!";
    }

    @GetMapping("/health")
    public String health() {
        return "API is running";
    }
}
