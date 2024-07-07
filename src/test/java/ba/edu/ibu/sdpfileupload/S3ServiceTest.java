package ba.edu.ibu.sdpfileupload;

import static org.mockito.Mockito.*;
import static org.junit.Assert.*;

import ba.edu.ibu.sdpfileupload.core.service.S3Service;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import java.io.IOException;

@SpringBootTest
public class S3ServiceTest {

    @Mock
    private AmazonS3 amazonS3;

    @InjectMocks
    private S3Service s3Service;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testUploadFile() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test data".getBytes());
        String bucketName = "test-bucket";
        String key = "test/test.txt";
        s3Service.uploadFile(bucketName, key, file);
        verify(amazonS3, times(1)).putObject(any(PutObjectRequest.class));
    }

    @Test
    public void testUploadFileForUser() throws IOException {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test data".getBytes());
        String bucketName = "test-bucket";
        String userName = "user1";
        String folderPath = "folder1";

        s3Service.uploadFileForUser(bucketName, userName, folderPath, file);
        verify(amazonS3, times(1)).putObject(argThat(request ->
                request.getKey().equals("user1/folder1/test.txt") &&
                        request.getBucketName().equals(bucketName)
        ));
    }

    @Test
    public void testDeleteFile() {
        String bucketName = "test-bucket";
        String key = "test/test.txt";

        s3Service.deleteFile(bucketName, key);

        verify(amazonS3, times(1)).deleteObject(argThat(request ->
                request.getBucketName().equals(bucketName) && request.getKey().equals(key)
        ));
    }





}
