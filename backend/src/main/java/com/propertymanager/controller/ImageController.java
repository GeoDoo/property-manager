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
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload/{propertyId}")
    public List<Image> uploadImages(@RequestParam("files") MultipartFile[] files, @PathVariable Long propertyId) throws IOException {
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
        return imageService.serveImage(filename);
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