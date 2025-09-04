package com.lloms.productservice.exception;

/**
 * Exception thrown when stock information is not found
 */
public class StockNotFoundException extends RuntimeException {
    public StockNotFoundException(String message) {
        super(message);
    }
    
    public StockNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
