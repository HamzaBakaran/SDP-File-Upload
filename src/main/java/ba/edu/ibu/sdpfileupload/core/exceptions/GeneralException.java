package ba.edu.ibu.sdpfileupload.core.exceptions;

public class GeneralException extends RuntimeException {
    private int httpCode = 500;

    public GeneralException(int httpCode) {
        this.httpCode = httpCode;
    }

    public GeneralException(int httpCode, String message) {
        super(message);
        this.httpCode = httpCode;
    }

    public GeneralException(String message, Exception e) {
        super(message, e);
    }

    public GeneralException(Exception e) {
        super(e);
    }

    public GeneralException(String message) {
        super(message);
    }
}
