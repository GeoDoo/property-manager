package com.propertymanager.service.impl;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Image;
import com.propertymanager.model.Property;
import com.propertymanager.repository.ImageRepository;
import com.propertymanager.repository.PropertyRepository;
import com.propertymanager.service.ImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

/**
 * Service implementation for managing property images.
 * Handles image upload, retrieval, and deletion operations.
 */
@Service
@Transactional
public class ImageServiceImpl implements ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageServiceImpl.class);
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @Value("${upload.path:/uploads}")
    private String uploadPath;

    private final ImageRepository imageRepository;
    private final PropertyRepository propertyRepository;

    public ImageServiceImpl(ImageRepository imageRepository, PropertyRepository propertyRepository) {
        this.imageRepository = imageRepository;
        this.propertyRepository = propertyRepository;
    }

    @Override
    public Image saveImage(MultipartFile file, Long propertyId) throws IOException {
        logger.debug("Saving image for property id: {}", propertyId);
        validateImage(file);
        
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        // Create uploads directory if it doesn't exist
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;

        // Save file to disk
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        // Create and save image entity
        Image image = new Image();
        image.setFileName(filename);
        image.setContentType(file.getContentType());
        image.setUrl("/images/" + filename);
        image.setProperty(property);

        return imageRepository.save(image);
    }

    @Override
    public void deleteImage(Long id) {
        logger.debug("Deleting image with id: {}", id);
        Image image = imageRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Image", "id", id));

        // Delete file from disk
        try {
            Path filePath = Paths.get(uploadPath).resolve(image.getFileName());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            logger.error("Failed to delete image file: {}", image.getFileName(), e);
            throw new RuntimeException("Failed to delete image file", e);
        }

        imageRepository.delete(image);
    }

    @Override
    public List<Image> getImagesForProperty(Long propertyId) {
        logger.debug("Fetching images for property id: {}", propertyId);
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));
        return property.getImages();
    }

    @Override
    public ResponseEntity<Resource> serveImage(String filename) throws IOException {
        logger.debug("Serving image: {}", filename);
        Path filePath = Paths.get(uploadPath).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            String contentType = determineContentType(filename);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
        } else {
            logger.warn("Image not found or not readable: {}", filename);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Validates the image file before saving.
     * Throws IllegalArgumentException if validation fails.
     *
     * @param file the image file to validate
     */
    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Only JPEG, PNG, GIF, and WebP images are allowed");
        }
    }

    /**
     * Determines the content type of an image file based on its extension.
     *
     * @param filename the name of the file
     * @return the corresponding media type
     */
    private String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        return switch (extension) {
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            default -> "image/jpeg";
        };
    }
} 