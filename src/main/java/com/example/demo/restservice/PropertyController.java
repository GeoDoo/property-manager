package com.example.demo.restservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.concurrent.atomic.AtomicLong;

@RestController
public class PropertyController {
    private static final String template = "This property is located in %s";
    private final AtomicLong counter = new AtomicLong();

    @GetMapping("/property")
    public Property property(@RequestParam(value = "area", defaultValue = "nowhere") String area) {
        return new Property(counter.incrementAndGet(), String.format(template, area));
    }
}
