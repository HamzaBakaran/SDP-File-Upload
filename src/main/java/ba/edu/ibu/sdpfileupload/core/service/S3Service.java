package ba.edu.ibu.sdpfileupload.core.service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class S3Service {

    @Autowired
    private AmazonS3 amazonS3;

    // Upload file to S3 bucket
    public void uploadFile(String bucketName, String key, MultipartFile file) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        amazonS3.putObject(new PutObjectRequest(bucketName, key, file.getInputStream(), metadata));
    }

    // Download file from S3 bucket
    public S3Object downloadFile(String bucketName, String key) {
        return amazonS3.getObject(new GetObjectRequest(bucketName, key));
    }

    // List objects in S3 bucket
    public List<S3ObjectSummary> listObjects(String bucketName) {
        ObjectListing objectListing = amazonS3.listObjects(bucketName);
        return objectListing.getObjectSummaries();
    }

    // Delete file from S3 bucket
    public void deleteFile(String bucketName, String key) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, key));
    }
}