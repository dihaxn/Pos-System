package com.lloms.productservice.repository;

import com.lloms.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for price update operations
 */
@Repository
public interface PriceUpdateRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.updatedAt >= :since")
    List<Product> findProductsUpdatedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT p FROM Product p WHERE p.price != p.originalPrice")
    List<Product> findProductsWithPriceChanges();
}
