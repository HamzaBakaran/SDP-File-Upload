package ba.edu.ibu.sdpfileupload.rest.dto;

public class LoginDTO {
    private String jwt;

    // Default constructor
    public LoginDTO() {}

    public LoginDTO(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}
