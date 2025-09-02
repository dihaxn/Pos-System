package com.lloms.reportingservice.repository;

import com.lloms.reportingservice.entity.ProductAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductAnalyticsRepository extends JpaRepository<ProductAnalytics, Long> {
    
    List<ProductAnalytics> findByOutletIdAndAnalysisDateBetween(
        Long outletId, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
    
    List<ProductAnalytics> findByProductIdAndAnalysisDateBetween(
        Long productId, 
        LocalDateTime startDate, 
        LocalDateTime endDate
    );
    
    @Query("SELECT pa FROM ProductAnalytics pa WHERE pa.outletId = :outletId ORDER BY pa.totalQuantitySold DESC")
    List<ProductAnalytics> findTopSellingProductsByOutlet(@Param("outletId") Long outletId);
    
    @Query("SELECT pa FROM ProductAnalytics pa WHERE pa.category = :category ORDER BY pa.totalRevenue DESC")
    List<ProductAnalytics> findTopProductsByCategory(@Param("category") String category);
    
    @Query("SELECT pa FROM ProductAnalytics pa WHERE pa.outletId = :outletId AND pa.analysisDate >= :startDate ORDER BY pa.stockTurnoverRate DESC")
    List<ProductAnalytics> findHighTurnoverProducts(@Param("outletId") Long outletId, @Param("startDate") LocalDateTime startDate);
}
