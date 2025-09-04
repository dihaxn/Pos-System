package com.lloms.productservice.exception;

/**
 * Exception thrown when date operations are invalid
 */
public class InvalidDateException extends RuntimeException {
    public InvalidDateException(String message) {
        super(message);
    }
    
    public InvalidDateException(String message, Throwable cause) {
        super(message, cause);
    }
}
