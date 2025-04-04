package com.propertymanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

/**
 * Represents an image associated with a property.
 * Stores metadata about the image file and its relationship to a property.
 */
@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "property")
@EqualsAndHashCode(exclude = "property")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "File name is required")
    @Column(nullable = false)
    private String fileName;

    @NotBlank(message = "Content type is required")
    @Column(nullable = false)
    @Pattern(regexp = "image/(jpeg|png|gif|webp)", message = "Only JPEG, PNG, GIF, and WebP images are allowed")
    private String contentType;

    @NotBlank(message = "URL is required")
    @Column(nullable = false)
    private String url;

    @NotNull(message = "Property is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnore
    private Property property;
} 