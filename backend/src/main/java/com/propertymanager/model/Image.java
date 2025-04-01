package com.propertymanager.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String contentType;
    private String url;

    @ManyToOne
    @JoinColumn(name = "property_id")
    @JsonIgnore
    private Property property;
} 