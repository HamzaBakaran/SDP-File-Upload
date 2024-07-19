package ba.edu.ibu.sdpfileupload.rest.controllers;

import ba.edu.ibu.sdpfileupload.core.service.UserService;
import ba.edu.ibu.sdpfileupload.rest.dto.UserDTO;
import ba.edu.ibu.sdpfileupload.rest.dto.UserRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }
    @RequestMapping(method = RequestMethod.GET,path ="/all" )
    @PreAuthorize("hasAnyAuthority( 'ADMIN','WORKER')")
    public ResponseEntity<List<UserDTO>> getUsers(){
        return ResponseEntity.ok(userService.findAllUsers());
    }
    @RequestMapping(method = RequestMethod.POST, path = "/register")
    @PreAuthorize("hasAnyAuthority( 'ADMIN','WORKER')")
    public ResponseEntity<UserDTO> register(@RequestBody UserRequestDTO user) {
        return ResponseEntity.ok(userService.addUser(user));
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{id}")
    @PreAuthorize("hasAnyAuthority( 'ADMIN','WORKER')")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/{id}")
    @PreAuthorize("hasAnyAuthority( 'ADMIN','WORKER')")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id, @RequestBody UserRequestDTO user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/{id}")
    @PreAuthorize("hasAnyAuthority( 'ADMIN','WORKER')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }



}
