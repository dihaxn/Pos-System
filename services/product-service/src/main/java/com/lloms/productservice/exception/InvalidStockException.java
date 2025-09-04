package com.lloms.productservice.exception;

/**
 * Exception thrown when stock operations are invalid
 */
public class InvalidStockException extends RuntimeException {
    public InvalidStockException(String message) {
        super(message);
    }
    
    public InvalidStockException(String message, Throwable cause) {
        super(message, cause);
    }
}
