package ba.edu.ibu.sdpfileupload.core.exceptions.auth;


import ba.edu.ibu.sdpfileupload.core.exceptions.GeneralException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidParametersSentException extends GeneralException {
    public InvalidParametersSentException() {
        super(HttpStatus.BAD_REQUEST.value());
    }

    public InvalidParametersSentException(String message) {
        super(HttpStatus.BAD_REQUEST.value(), message);
    }
}