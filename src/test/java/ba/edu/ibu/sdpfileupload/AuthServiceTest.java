package ba.edu.ibu.sdpfileupload;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

import ba.edu.ibu.sdpfileupload.core.exceptions.repository.ResourceNotFoundException;
import ba.edu.ibu.sdpfileupload.core.model.User;
import ba.edu.ibu.sdpfileupload.core.model.enums.UserType;
import ba.edu.ibu.sdpfileupload.core.repository.UserRepository;
import ba.edu.ibu.sdpfileupload.core.service.AuthService;
import ba.edu.ibu.sdpfileupload.core.service.JwtService;
import ba.edu.ibu.sdpfileupload.rest.dto.LoginDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.LoginRequestDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserRequestDTO;
import com.amazonaws.services.appstream.model.ResourceAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void signUp_UserAlreadyExists_ThrowsException() {
        UserRequestDTO userRequestDTO = new UserRequestDTO();
        userRequestDTO.setEmail("test@example.com");
        userRequestDTO.setUsername("testUser");
        userRequestDTO.setPassword("password123");
        userRequestDTO.setUserType(UserType.GUEST);

        when(userRepository.findByEmail(any(String.class))).thenReturn(Optional.of(new User()));

        assertThrows(ResourceAlreadyExistsException.class, () -> {
            authService.signUp(userRequestDTO);
        });
    }

    @Test
    void signUp_NewUser_ReturnsUserDTO() {
        UserRequestDTO userRequestDTO = new UserRequestDTO();
        userRequestDTO.setEmail("newuser@example.com");
        userRequestDTO.setUsername("newuser");
        userRequestDTO.setPassword("password123");
        userRequestDTO.setUserType(UserType.GUEST);

        when(userRepository.findByEmail(any(String.class))).thenReturn(Optional.empty());
        when(userRepository.findByUsername(any(String.class))).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any(String.class))).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);  // Mock ID assignment after saving
            return user;
        });

        UserDTO result = authService.signUp(userRequestDTO);

        assertNotNull(result);
        assertEquals("newuser@example.com", result.getEmail());
    }

    @Test
    void signIn_ValidCredentials_ReturnsLoginDTO() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("user@example.com", "password123");

        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("password123");
        user.setUserType(UserType.GUEST);  // Ensure UserType is set

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(user, "password123", user.getAuthorities()));
        when(userRepository.findByEmail(any(String.class))).thenReturn(Optional.of(user));
        when(jwtService.generateToken(any(User.class))).thenReturn("dummyToken");

        LoginDTO result = authService.signIn(loginRequestDTO);

        assertNotNull(result);
        assertEquals("dummyToken", result.getJwt());
    }

    @Test
    void signIn_UserNotFound_ThrowsException() {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO("user@example.com", "password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("user@example.com", "password123"));
        when(userRepository.findByEmail(any(String.class))).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            authService.signIn(loginRequestDTO);
        });
    }
}
