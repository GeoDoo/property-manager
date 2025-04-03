package com.propertymanager.service;

import com.propertymanager.exception.ResourceNotFoundException;
import com.propertymanager.model.Image;
import com.propertymanager.model.Property;
import com.propertymanager.repository.ImageRepository;
import com.propertymanager.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private ImageServiceImpl imageService;

    @TempDir
    Path tempDir;

    private Property testProperty;
    private Image testImage;
    private MockMultipartFile testFile;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(imageService, "uploadPath", tempDir.toString());

        testProperty = Property.builder()
            .id(1L)
            .address("123 Test St")
            .build();

        testImage = new Image();
        testImage.setId(1L);
        testImage.setFileName("test.jpg");
        testImage.setContentType("image/jpeg");
        testImage.setUrl("/images/test.jpg");
        testImage.setProperty(testProperty);

        testFile = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
    }

    @Test
    void saveImage_ShouldSaveImageSuccessfully() throws IOException {
        // Given
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));
        when(imageRepository.save(any(Image.class))).thenReturn(testImage);

        // When
        Image savedImage = imageService.saveImage(testFile, 1L);

        // Then
        assertThat(savedImage).isNotNull();
        assertThat(savedImage.getContentType()).isEqualTo("image/jpeg");
        assertThat(savedImage.getProperty()).isEqualTo(testProperty);
        verify(imageRepository).save(any(Image.class));
    }

    @Test
    void saveImage_WithInvalidProperty_ShouldThrowException() {
        // Given
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThrows(ResourceNotFoundException.class, () ->
            imageService.saveImage(testFile, 1L));
    }

    @Test
    void saveImage_WithInvalidFileType_ShouldThrowException() {
        // Given
        MockMultipartFile invalidFile = new MockMultipartFile(
            "file",
            "test.txt",
            "text/plain",
            "test content".getBytes()
        );

        // When/Then
        assertThrows(IllegalArgumentException.class, () ->
            imageService.saveImage(invalidFile, 1L));
    }

    @Test
    void deleteImage_ShouldDeleteSuccessfully() throws IOException {
        // Given
        Path imagePath = tempDir.resolve("test.jpg");
        Files.write(imagePath, "test content".getBytes());
        when(imageRepository.findById(1L)).thenReturn(Optional.of(testImage));

        // When
        imageService.deleteImage(1L);

        // Then
        verify(imageRepository).delete(testImage);
        assertThat(Files.exists(imagePath)).isFalse();
    }

    @Test
    void deleteImage_WithNonExistentImage_ShouldThrowException() {
        // Given
        when(imageRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThrows(ResourceNotFoundException.class, () ->
            imageService.deleteImage(1L));
    }

    @Test
    void getImagesForProperty_ShouldReturnImages() {
        // Given
        List<Image> images = List.of(testImage);
        testProperty.setImages(images);
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        // When
        List<Image> result = imageService.getImagesForProperty(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isEqualTo(testImage);
    }

    @Test
    void getImagesForProperty_WithNonExistentProperty_ShouldThrowException() {
        // Given
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // When/Then
        assertThrows(ResourceNotFoundException.class, () ->
            imageService.getImagesForProperty(1L));
    }

    @Test
    void serveImage_ShouldReturnImageResource() throws IOException {
        // Given
        Path imagePath = tempDir.resolve("test.jpg");
        Files.write(imagePath, "test content".getBytes());

        // When
        ResponseEntity<Resource> response = imageService.serveImage("test.jpg");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getHeaders().getContentType()).isEqualTo(MediaType.IMAGE_JPEG);
    }

    @Test
    void serveImage_WithNonExistentFile_ShouldReturnNotFound() throws IOException {
        // When
        ResponseEntity<Resource> response = imageService.serveImage("nonexistent.jpg");

        // Then
        assertThat(response.getStatusCodeValue()).isEqualTo(404);
    }
} 