package ba.edu.ibu.sdpfileupload.core.service;

import ba.edu.ibu.sdpfileupload.core.exceptions.repository.ResourceNotFoundException;
import ba.edu.ibu.sdpfileupload.core.model.User;
import ba.edu.ibu.sdpfileupload.core.repository.UserRepository;
import ba.edu.ibu.sdpfileupload.rest.dto.UserDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserRequestDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, UserRepository userRepository1)
    {

        this.userRepository = userRepository;
    }

    public List<UserDTO> findAllUsers() {
        List<User> users= (List<User>) userRepository.findAll();
        return users
                .stream()
                .map(UserDTO::new)
                .collect(toList());
    }


    public  UserDTO findById(Integer id){
        Optional<User> user=userRepository.findById(id);
        if (user.isEmpty()){
            throw new ResourceNotFoundException("The user with the given ID does not exist.");
        }
        return new UserDTO(user.get());
    }
    public UserDTO addUser(UserRequestDTO payload) {
        User user = userRepository.save(payload.toEntity());
        return new UserDTO(user);
    }
    public UserDTO updateUser(Integer id, UserRequestDTO payload) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("The user with the given ID does not exist.");
        }
        User updatedUser = payload.toEntity();
        updatedUser.setId(user.get().getId());
        updatedUser = userRepository.save(updatedUser);
        return new UserDTO(updatedUser);
    }
    public void deleteUser(Integer id) {
        Optional<User> user = userRepository.findById(id);
        user.ifPresent(userRepository::delete);
    }

    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

}
