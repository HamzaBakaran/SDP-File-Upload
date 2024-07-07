package ba.edu.ibu.sdpfileupload;

import ba.edu.ibu.sdpfileupload.core.model.enums.UserType;
import ba.edu.ibu.sdpfileupload.rest.dto.LoginDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.LoginRequestDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApplicationIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getBaseUrl() {
        return "http://localhost:" + port;
    }

    @Test
    public void testRegisterLoginAndUploadFile() throws Exception {
        // Register a new user
        UserRequestDTO userRequest = new UserRequestDTO();
        userRequest.setFirstName("John");
        userRequest.setLastName("Doe");
        userRequest.setEmail("john.doe@example.com");
        userRequest.setUsername("john.doe@example.com");
        userRequest.setPassword("password123");
        userRequest.setUserType(UserType.GUEST);

        ResponseEntity<UserDTO> registerResponse = restTemplate.postForEntity(getBaseUrl() + "/api/auth/register", userRequest, UserDTO.class);
        assertEquals(200, registerResponse.getStatusCodeValue());
        assertNotNull(registerResponse.getBody());

        System.out.println("Register response: " + registerResponse.getBody());

// Log in the registered user
        LoginRequestDTO loginRequest = new LoginRequestDTO("john.doe@example.com", "password123");
        ResponseEntity<LoginDTO> loginResponse = restTemplate.postForEntity(getBaseUrl() + "/api/auth/login", loginRequest, LoginDTO.class);
        System.out.println("Login response: " + loginResponse.getBody());
        assertEquals(200, loginResponse.getStatusCodeValue());
        assertNotNull(loginResponse.getBody());

// Log or assert the properties of the LoginDTO
        LoginDTO loginDTO = loginResponse.getBody();
        assertNotNull(loginDTO.getJwt()); // Assuming your LoginDTO has a 'jwt' field for the token
        System.out.println("Token: " + loginDTO.getJwt()); // Print the JWT token

        // Upload a file
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + loginDTO.getJwt());
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ClassPathResource("testfile.txt"));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> uploadResponse = restTemplate.exchange(getBaseUrl() + "/api/s3/upload", HttpMethod.POST, requestEntity, String.class);
        assertEquals(200, uploadResponse.getStatusCodeValue());
        assertEquals("File uploaded successfully", uploadResponse.getBody());

        System.out.println("Upload response: " + uploadResponse.getBody());




    }
}
