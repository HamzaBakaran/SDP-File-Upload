package ba.edu.ibu.sdpfileupload.rest.controllers;

import ba.edu.ibu.sdpfileupload.core.service.MinIOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final MinIOService minIOService;

    @Autowired
    public FileController(MinIOService minIOService) {
        this.minIOService = minIOService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String uniqueFileName = minIOService.generateUniqueFileName(file.getOriginalFilename());
            minIOService.uploadFile(uniqueFileName, file.getInputStream(), file.getContentType());
            String objectUrl = minIOService.getObjectUrl(uniqueFileName);
            // You can now save the object URL to your database or return it to the client
            return ResponseEntity.ok("File uploaded successfully. Object URL: " + objectUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }
}