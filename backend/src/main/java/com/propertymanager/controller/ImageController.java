package com.propertymanager.controller;

import com.propertymanager.model.Image;
import com.propertymanager.service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ImageController {

    private final ImageService imageService;
    private final String uploadPath;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
        this.uploadPath = "/uploads"; // Should match the value in ImageServiceImpl
    }

    @PostMapping("/upload/{propertyId}")
    public List<Image> uploadImages(@RequestParam("files") MultipartFile[] files, @PathVariable Long propertyId) throws IOException {
        // Create uploads directory if it doesn't exist
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        List<Image> uploadedImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                uploadedImages.add(imageService.saveImage(file, propertyId));
            }
        }
        return uploadedImages;
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
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
        switch (extension) {
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            default:
                return "image/jpeg";
        }
    }

    @GetMapping("/property/{propertyId}")
    public List<Image> getImagesForProperty(@PathVariable Long propertyId) {
        return imageService.getImagesForProperty(propertyId);
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
    }
} 