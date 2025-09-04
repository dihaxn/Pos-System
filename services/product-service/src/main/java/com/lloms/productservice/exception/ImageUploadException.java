package com.lloms.productservice.exception;

/**
 * Exception thrown when image upload operations fail
 */
public class ImageUploadException extends RuntimeException {
    public ImageUploadException(String message) {
        super(message);
    }
    
    public ImageUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
