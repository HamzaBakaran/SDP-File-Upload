package ba.edu.ibu.sdpfileupload.core.service;

import ba.edu.ibu.sdpfileupload.core.exceptions.repository.ResourceNotFoundException;
import ba.edu.ibu.sdpfileupload.core.model.User;
import ba.edu.ibu.sdpfileupload.core.repository.UserRepository;
import ba.edu.ibu.sdpfileupload.rest.dto.LoginDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.LoginRequestDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserRequestDTO;
import com.amazonaws.services.appstream.model.ResourceAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public UserDTO signUp(UserRequestDTO userRequestDTO) {
        // Check if a user with the same email already exists
        Optional<User> existingUserByEmail = userRepository.findByEmail(userRequestDTO.getEmail());
        if (existingUserByEmail.isPresent()) {
            throw new ResourceAlreadyExistsException("User with this email already exists.");
        }

        // Check if a user with the same username already exists
        Optional<User> existingUserByUsername = userRepository.findByUsername(userRequestDTO.getUsername());
        if (existingUserByUsername.isPresent()) {
            throw new ResourceAlreadyExistsException("User with this username already exists.");
        }

        userRequestDTO.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        User user = userRepository.save(userRequestDTO.toEntity());

        return new UserDTO(user);
    }

    public LoginDTO signIn(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword())
        );
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("This user does not exist."));
        String jwt = jwtService.generateToken(user);

        return new LoginDTO(jwt);
    }
}
