package ba.edu.ibu.sdpfileupload.rest.dto;

import ba.edu.ibu.sdpfileupload.core.model.User;
import ba.edu.ibu.sdpfileupload.core.model.enums.UserType;

public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private UserType userType;
    private String email;

    public UserDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username =user.getUsername();
        // Set userType to GUEST only if it's null
        this.userType = (user.getUserType() != null) ? user.getUserType() : UserType.GUEST;
        this.email = user.getEmail();
    }



    public String getUserName() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}
