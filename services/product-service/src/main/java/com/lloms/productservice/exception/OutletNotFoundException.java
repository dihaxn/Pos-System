package com.lloms.productservice.exception;

/**
 * Exception thrown when an outlet is not found
 */
public class OutletNotFoundException extends RuntimeException {

    public OutletNotFoundException(String message) {
        super(message);
    }

    public OutletNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
