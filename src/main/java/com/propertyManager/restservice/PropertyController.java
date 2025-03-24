package com.propertyManager.restservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.simple.JdbcClient;

import javax.sql.DataSource;
import java.util.Collection;


@RestController
public class PropertyController {
    private final JdbcClient db;

    PropertyController(DataSource dataSource) {
        this.db = JdbcClient.create(dataSource);
    }

    @GetMapping("/property")
    Collection<Property> getProperties() {
        return this.db
                .sql("SELECT * FROM properties")
                .query((rs, rowNum) -> new Property(rs.getInt("price")
                ))
                .list();
    }
}
