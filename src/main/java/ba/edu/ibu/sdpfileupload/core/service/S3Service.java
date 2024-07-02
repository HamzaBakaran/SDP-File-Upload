package ba.edu.ibu.sdpfileupload.core.service;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
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
    public void uploadFileForUser(String bucketName, String userName, String folderPath, MultipartFile file) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());

        // Ensure folderPath is not null and remove trailing slashes
        if (folderPath == null) {
            folderPath = "";
        } else {
            folderPath = folderPath.replaceAll("/$", "");
        }

        // Construct S3 key ensuring no double slashes
        String s3Key = userName + (folderPath.isEmpty() ? "" : "/" + folderPath) + "/" + file.getOriginalFilename();
        s3Key = s3Key.replaceAll("//", "/"); // Ensure no double slashes in the key

        amazonS3.putObject(new PutObjectRequest(bucketName, s3Key, file.getInputStream(), metadata));
    }

    // Create a folder in S3 bucket for a specific user
    public void createFolder(String bucketName, String userName, String folderPath) {
        String folderKey = userName + "/" + folderPath + "/";
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(0);
        amazonS3.putObject(new PutObjectRequest(bucketName, folderKey, new ByteArrayInputStream(new byte[0]), metadata));
    }

    // Move file from one key to another in S3 bucket
    public void moveFile(String bucketName, String sourceKey, String destinationKey) {
        CopyObjectRequest copyObjRequest = new CopyObjectRequest(bucketName, sourceKey, bucketName, destinationKey);
        amazonS3.copyObject(copyObjRequest);
        amazonS3.deleteObject(new DeleteObjectRequest(bucketName, sourceKey));
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

    // List files for a specific user
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

    // List files for a specific user and folder path
    public List<S3ObjectSummary> listFilesForUserInFolder(String bucketName, String userName, String folderPath) {
        ListObjectsV2Request request = new ListObjectsV2Request()
                .withBucketName(bucketName)
                .withPrefix(userName + (folderPath.isEmpty() ? "" : "/" + folderPath) + "/");

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

    // Delete all objects in a folder and then the folder itself
    public void deleteFolder(String bucketName, String folderKey) {
        ListObjectsV2Request listObjectsV2Request = new ListObjectsV2Request()
                .withBucketName(bucketName)
                .withPrefix(folderKey);

        ListObjectsV2Result listObjectsV2Result;
        do {
            listObjectsV2Result = amazonS3.listObjectsV2(listObjectsV2Request);
            List<S3ObjectSummary> objectSummaries = listObjectsV2Result.getObjectSummaries();

            for (S3ObjectSummary objectSummary : objectSummaries) {
                amazonS3.deleteObject(new DeleteObjectRequest(bucketName, objectSummary.getKey()));
            }

            listObjectsV2Request.setContinuationToken(listObjectsV2Result.getNextContinuationToken());
        } while (listObjectsV2Result.isTruncated());
    }
}
