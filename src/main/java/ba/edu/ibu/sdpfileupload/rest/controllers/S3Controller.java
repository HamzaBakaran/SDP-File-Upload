package ba.edu.ibu.sdpfileupload.rest.controllers;

import ba.edu.ibu.sdpfileupload.core.service.S3Service;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import io.jsonwebtoken.Jwt;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Collections;
import java.util.List;


@RestController
@SecurityRequirement(name = "JWT Security")
@RequestMapping("/api/s3")
public class S3Controller {

    @Autowired
    private S3Service s3Service;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;


    @PostMapping("/uploadauto")
    @PreAuthorize("hasAuthority('GUEST')")
    public ResponseEntity<String> uploadFileAuto(@RequestPart("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();


            // Proceed with uploading the file using the extracted user ID
            s3Service.uploadFileForUser(bucketName, userName, file.getOriginalFilename(), file);

            return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('GUEST')")
    public ResponseEntity<List<S3ObjectSummary>> listFiles() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();

            // Retrieve the list of files uploaded by the authenticated user
            List<S3ObjectSummary> fileList = s3Service.listFilesForUser(bucketName, userName);

            return ResponseEntity.ok().body(fileList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }


    @GetMapping("/download/{key}")
    public ResponseEntity<S3Object> downloadFile(@PathVariable String key) {
        S3Object file = s3Service.downloadFile(bucketName, key);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + key)
                .body(file);
    }



    @DeleteMapping("/delete/{key}")
    public ResponseEntity<String> deleteFile(@PathVariable String key) {
        s3Service.deleteFile(bucketName, key);
        return ResponseEntity.ok().body("File deleted successfully");
    }
}
