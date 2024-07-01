package ba.edu.ibu.sdpfileupload.rest.controllers;

import ba.edu.ibu.sdpfileupload.core.service.S3Service;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import io.jsonwebtoken.Jwt;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('GUEST')")
    public ResponseEntity<String> uploadFile(@RequestPart("file") MultipartFile file, @RequestParam(required = false) String folderPath) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();

            // Proceed with uploading the file using the extracted user ID and folder path
            s3Service.uploadFileForUser(bucketName, userName, folderPath, file);

            return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }

    @GetMapping("/list")
    @PreAuthorize("hasAuthority('GUEST')")
    public ResponseEntity<List<S3ObjectSummary>> listFiles(@RequestParam(required = false) String folderPath) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();

            List<S3ObjectSummary> fileList;
            if (folderPath != null && !folderPath.isEmpty()) {
                // Retrieve the list of files in the specified folder
                fileList = s3Service.listFilesForUserInFolder(bucketName, userName, folderPath);
            } else {
                // Retrieve the list of all files uploaded by the authenticated user
                fileList = s3Service.listFilesForUser(bucketName, userName);
            }

            return ResponseEntity.ok().body(fileList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam String key) {
        S3Object file = s3Service.downloadFile(bucketName, key);
        byte[] fileBytes;
        try {
            fileBytes = s3Service.convertS3ObjectToByteArray(file);
        } catch (IOException e) {
            // Handle the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", key);

        return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam String key) {
        if (key.endsWith("/")) {
            s3Service.deleteFolder(bucketName, key);
            return ResponseEntity.ok().body("Folder deleted successfully");
        } else {
            s3Service.deleteFile(bucketName, key);
            return ResponseEntity.ok().body("File deleted successfully");
        }
    }

    @PostMapping("/create-folder")
    @PreAuthorize("hasAuthority('GUEST')")
    public ResponseEntity<String> createFolder(@RequestParam String folderPath) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();

            s3Service.createFolder(bucketName, userName, folderPath);

            return ResponseEntity.status(HttpStatus.OK).body("Folder created successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create folder");
        }
    }

    @PostMapping("/move-file")
    @PreAuthorize("hasAuthority('GUEST')")
    public ResponseEntity<String> moveFile(@RequestParam String sourceKey, @RequestParam String destinationKey) {
        try {
            s3Service.moveFile(bucketName, sourceKey, destinationKey);
            return ResponseEntity.status(HttpStatus.OK).body("File moved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to move file");
        }
    }



}
