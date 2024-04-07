package ba.edu.ibu.sdpfileupload.rest.controllers;

import ba.edu.ibu.sdpfileupload.core.service.S3Service;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    @Autowired
    private S3Service s3Service;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            s3Service.uploadFile(bucketName, file.getOriginalFilename(), file);
            return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }

    @GetMapping("/download/{key}")
    public ResponseEntity<S3Object> downloadFile(@PathVariable String key) {
        S3Object file = s3Service.downloadFile(bucketName, key);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + key)
                .body(file);
    }

    @GetMapping("/list")
    public ResponseEntity<List<S3ObjectSummary>> listFiles() {
        List<S3ObjectSummary> fileList = s3Service.listObjects(bucketName);
        return ResponseEntity.ok().body(fileList);
    }

    @DeleteMapping("/delete/{key}")
    public ResponseEntity<String> deleteFile(@PathVariable String key) {
        s3Service.deleteFile(bucketName, key);
        return ResponseEntity.ok().body("File deleted successfully");
    }
}
