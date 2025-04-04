package com.propertymanager.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageImpl;

/**
 * Configuration class for Jackson to handle Spring Data's Page implementation correctly.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Register modules
        mapper.registerModule(new JavaTimeModule());
        
        // Configure serialization features
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        
        // Add mixin for PageImpl
        mapper.addMixIn(PageImpl.class, PageImplMixin.class);
        
        return mapper;
    }
    
    /**
     * Mixin to control the serialization of PageImpl objects.
     * We want to ignore the 'pageable' property to prevent serialization issues.
     */
    @JsonIgnoreProperties(value = {"pageable", "sort", "empty", "numberOfElements"}, ignoreUnknown = true)
    interface PageImplMixin {
        // This is just a marker interface to apply JSON properties
    }
} 