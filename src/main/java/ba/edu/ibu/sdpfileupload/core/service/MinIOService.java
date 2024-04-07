package ba.edu.ibu.sdpfileupload.core.service;

import io.minio.*;
import io.minio.errors.MinioException;
import io.minio.messages.Bucket;
import io.minio.messages.Item;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Service
public class MinIOService {
    private final MinioClient minioClient;
    private final String bucketName;

    public MinIOService(
            @Value("${minio.endpoint}") String endpoint,
            @Value("${minio.accessKey}") String accessKey,
            @Value("${minio.secretKey}") String secretKey,
            @Value("${minio.bucketName}") String bucketName) {
        this.bucketName = bucketName;
        try {
            minioClient = MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(accessKey, secretKey)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize MinIO client", e);
        }
    }

    public boolean bucketExists() {
        try {
            return minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to check if bucket exists", e);
        }
    }

    public void createBucket() {
        try {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create bucket", e);
        }
    }

    public void uploadFile(String fileName, InputStream inputStream, String contentType) {
        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .stream(inputStream, inputStream.available(), -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to MinIO", e);
        }
    }

    public String getObjectUrl(String fileName) {
        try {
            return minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get object URL from MinIO", e);
        }
    }
    public String generateUniqueFileName(String originalFileName) {
        String[] parts = originalFileName.split("\\.");
        String extension = parts[parts.length - 1];
        return UUID.randomUUID() + "." + extension;
    }
}