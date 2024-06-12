package com.propertyManager.restservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PropertyController {
    @GetMapping("/property")
    public Property property() {
        var price = 450000;

        return new Property(price);
    }
}
