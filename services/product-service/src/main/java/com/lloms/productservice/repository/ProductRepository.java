package com.lloms.productservice.repository;

import com.lloms.productservice.entity.Product;
import com.lloms.productservice.entity.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Product entity
 * Extends JpaSpecificationExecutor for dynamic queries
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    /**
     * Find product by SKU
     */
    Optional<Product> findBySkuAndDeletedFalse(String sku);

    /**
     * Find product by barcode
     */
    Optional<Product> findByBarcodeAndDeletedFalse(String barcode);

    /**
     * Find products by category
     */
    Page<Product> findByCategoryIdAndDeletedFalse(Long categoryId, Pageable pageable);

    /**
     * Find products by outlet
     */
    Page<Product> findByOutletIdAndDeletedFalse(Long outletId, Pageable pageable);

    /**
     * Find products by status
     */
    Page<Product> findByStatusAndDeletedFalse(ProductStatus status, Pageable pageable);

    /**
     * Find products by name containing (case insensitive)
     */
    Page<Product> findByNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);

    /**
     * Find products with low stock
     */
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND p.minStockLevel IS NOT NULL AND p.stockQuantity <= p.minStockLevel")
    List<Product> findLowStockProducts();

    /**
     * Find out of stock products
     */
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND p.stockQuantity <= 0")
    List<Product> findOutOfStockProducts();

    /**
     * Find products by price range
     */
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    /**
     * Find products by multiple criteria
     */
    @Query("SELECT p FROM Product p WHERE p.deleted = false " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:outletId IS NULL OR p.outlet.id = :outletId) " +
            "AND (:status IS NULL OR p.status = :status) " +
            "AND (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Product> findByCriteria(@Param("categoryId") Long categoryId,
            @Param("outletId") Long outletId,
            @Param("status") ProductStatus status,
            @Param("name") String name,
            Pageable pageable);

    /**
     * Check if SKU exists (excluding current product)
     */
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.sku = :sku AND p.deleted = false AND (:id IS NULL OR p.id != :id)")
    boolean existsBySkuAndIdNot(@Param("sku") String sku, @Param("id") Long id);

    /**
     * Check if barcode exists (excluding current product)
     */
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.barcode = :barcode AND p.deleted = false AND (:id IS NULL OR p.id != :id)")
    boolean existsByBarcodeAndIdNot(@Param("barcode") String barcode, @Param("id") Long id);

    /**
     * Get product count by category
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.deleted = false")
    long countByCategoryId(@Param("categoryId") Long categoryId);

    /**
     * Get product count by outlet
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.outlet.id = :outletId AND p.deleted = false")
    long countByOutletId(@Param("outletId") Long outletId);

    /**
     * Find products for inventory report
     */
    @Query("SELECT p FROM Product p WHERE p.deleted = false " +
            "AND (:outletId IS NULL OR p.outlet.id = :outletId) " +
            "ORDER BY p.category.name, p.name")
    List<Product> findForInventoryReport(@Param("outletId") Long outletId);
}
