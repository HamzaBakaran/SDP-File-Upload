package ba.edu.ibu.sdpfileupload.core.service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
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

    // Upload file to S3 bucket for a specific user
    public void uploadFileForUser(String bucketName, String userName, String key, MultipartFile file) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        amazonS3.putObject(new PutObjectRequest(bucketName, userName + "/" + key, file.getInputStream(), metadata));
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
    public List<S3ObjectSummary> listFilesForUser(String bucketName, String userName) {
        ListObjectsV2Request request = new ListObjectsV2Request()
                .withBucketName(bucketName)
                .withPrefix(userName + "/");

        List<S3ObjectSummary> fileList = new ArrayList<>();

        ListObjectsV2Result result;
        do {
            result = amazonS3.listObjectsV2(request);
            fileList.addAll(result.getObjectSummaries());
            request.setContinuationToken(result.getNextContinuationToken());
        } while (result.isTruncated());

        return fileList;
    }

    public byte[] convertS3ObjectToByteArray(S3Object s3Object) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int bytesRead;
        while ((bytesRead = s3Object.getObjectContent().read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        return outputStream.toByteArray();
    }

}
