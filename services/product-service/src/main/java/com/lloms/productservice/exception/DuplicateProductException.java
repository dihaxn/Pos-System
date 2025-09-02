package com.lloms.productservice.exception;

/**
 * Exception thrown when attempting to create a duplicate product
 */
public class DuplicateProductException extends RuntimeException {

    public DuplicateProductException(String message) {
        super(message);
    }

    public DuplicateProductException(String message, Throwable cause) {
        super(message, cause);
    }
}
