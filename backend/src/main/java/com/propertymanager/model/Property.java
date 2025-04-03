package com.propertymanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "properties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = "images")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Address is required")
    @Column(length = 1000)
    @jakarta.validation.constraints.Size(max = 1000, message = "Address must not exceed 1000 characters")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Positive(message = "Price must be greater than 0")
    private Double price;

    @Positive(message = "Number of bedrooms must be greater than 0")
    private Integer bedrooms;
    
    @Positive(message = "Number of bathrooms must be greater than 0")
    private Integer bathrooms;
    
    @Positive(message = "Square footage must be greater than 0")
    private Double squareFootage;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Image> images = new ArrayList<>();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public Double getSquareFootage() {
        return squareFootage;
    }

    public void setSquareFootage(Double squareFootage) {
        this.squareFootage = squareFootage;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public void addImage(Image image) {
        images.add(image);
        image.setProperty(this);
    }

    public void removeImage(Image image) {
        images.remove(image);
        image.setProperty(null);
    }
} 