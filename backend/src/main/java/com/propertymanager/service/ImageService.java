package com.propertymanager.service;

import com.propertymanager.model.Image;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface ImageService {
    Image saveImage(MultipartFile file, Long propertyId) throws IOException;
    void deleteImage(Long id);
    List<Image> getImagesForProperty(Long propertyId);
} 