package com.propertymanager.service;

import com.propertymanager.model.Image;
import com.propertymanager.model.Property;
import com.propertymanager.repository.ImageRepository;
import com.propertymanager.repository.PropertyRepository;
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

@Service
@Transactional
public class ImageServiceImpl implements ImageService {

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
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));

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
        Image image = imageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));

        // Delete file from disk
        try {
            Path filePath = Paths.get(uploadPath).resolve(image.getFileName());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image file", e);
        }

        imageRepository.delete(image);
    }

    @Override
    public List<Image> getImagesForProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        return property.getImages();
    }

    @Override
    public ResponseEntity<Resource> serveImage(String filename) throws IOException {
        Path filePath = Paths.get(uploadPath).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            String contentType = determineContentType(filename);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

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