package com.lloms.productservice.service;

import com.lloms.productservice.dto.paginated.PaginatedResponseGetAllProductsDTO;
import com.lloms.productservice.entity.Product;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for product operations
 */
public interface ProductService {
    
    PaginatedResponseGetAllProductsDTO getAllProducts(Pageable pageable);
    
    Product getProductById(Long id);
    
    Product createProduct(Product product);
    
    Product updateProduct(Long id, Product product);
    
    void deleteProduct(Long id);
    
    Product updateStock(Long productId, Integer quantity);
}