package ba.edu.ibu.sdpfileupload.rest.dto;

import ba.edu.ibu.sdpfileupload.core.model.User;
import ba.edu.ibu.sdpfileupload.core.model.enums.UserType;

import java.util.HashMap;
import java.util.Map;

public class UserRequestDTO {
    private UserType userType;
    private String firstName;
    private String lastName;
    private String email;
    private String username;

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    private String password;

    public  UserRequestDTO() { }

    public UserRequestDTO(User user) {
        // Set userType to GUEST only if it's null
        this.userType = (user.getUserType() != null) ? user.getUserType() : UserType.GUEST;
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.password = user.getPassword();
    }
    public User toEntity() {
        User user = new User();
        user.setUserType(userType);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }
    public Map<String, Object> toMap() {
        Map<String, Object> userAttributes = new HashMap<>();
        userAttributes.put("userType", userType);
        userAttributes.put("firstName", firstName);
        userAttributes.put("lastName", lastName);
        userAttributes.put("email", email);
        userAttributes.put("username", username);
        userAttributes.put("password", password);



        return userAttributes;
    }
}
