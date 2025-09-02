package com.lloms.productservice.service;

import com.lloms.productservice.dto.request.CreateProductRequest;
import com.lloms.productservice.dto.request.UpdateProductRequest;
import com.lloms.productservice.dto.response.ProductResponse;
import com.lloms.productservice.entity.Product;
import com.lloms.productservice.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for Product operations
 */
public interface ProductService {

    /**
     * Create a new product
     */
    ProductResponse createProduct(CreateProductRequest request, String createdBy);

    /**
     * Update an existing product
     */
    ProductResponse updateProduct(Long id, UpdateProductRequest request, String updatedBy);

    /**
     * Get product by ID
     */
    ProductResponse getProductById(Long id);

    /**
     * Get product by SKU
     */
    ProductResponse getProductBySku(String sku);

    /**
     * Get product by barcode
     */
    ProductResponse getProductByBarcode(String barcode);

    /**
     * Get all products with pagination
     */
    Page<ProductResponse> getAllProducts(Pageable pageable);

    /**
     * Get products by category
     */
    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    /**
     * Get products by outlet
     */
    Page<ProductResponse> getProductsByOutlet(Long outletId, Pageable pageable);

    /**
     * Get products by status
     */
    Page<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable);

    /**
     * Search products by name
     */
    Page<ProductResponse> searchProductsByName(String name, Pageable pageable);

    /**
     * Get products by price range
     */
    Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    /**
     * Get products by multiple criteria
     */
    Page<ProductResponse> getProductsByCriteria(Long categoryId, Long outletId, ProductStatus status, String name,
            Pageable pageable);

    /**
     * Get low stock products
     */
    List<ProductResponse> getLowStockProducts();

    /**
     * Get out of stock products
     */
    List<ProductResponse> getOutOfStockProducts();

    /**
     * Update product stock
     */
    ProductResponse updateStock(Long id, Integer quantity, String reason, String updatedBy);

    /**
     * Update product price
     */
    ProductResponse updatePrice(Long id, BigDecimal newPrice, String reason, String updatedBy);

    /**
     * Change product status
     */
    ProductResponse changeStatus(Long id, ProductStatus status, String updatedBy);

    /**
     * Delete product (soft delete)
     */
    void deleteProduct(Long id, String deletedBy);

    /**
     * Check if SKU exists
     */
    boolean existsBySku(String sku, Long excludeId);

    /**
     * Check if barcode exists
     */
    boolean existsByBarcode(String barcode, Long excludeId);

    /**
     * Get product count by category
     */
    long getProductCountByCategory(Long categoryId);

    /**
     * Get product count by outlet
     */
    long getProductCountByOutlet(Long outletId);

    /**
     * Get inventory report
     */
    List<ProductResponse> getInventoryReport(Long outletId);
}
