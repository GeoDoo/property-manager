package com.propertymanager.repository;

import com.propertymanager.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    @Query("SELECT p FROM Property p WHERE " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :address, '%')) AND " +
           "p.price BETWEEN :minPrice AND :maxPrice AND " +
           "(:bedrooms IS NULL OR p.bedrooms = :bedrooms)")
    List<Property> searchProperties(
            @Param("address") String address,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("bedrooms") Integer bedrooms);
} 