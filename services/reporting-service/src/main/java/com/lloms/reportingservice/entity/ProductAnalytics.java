package com.lloms.reportingservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ProductAnalytics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "product_name")
    private String productName;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "outlet_id", nullable = false)
    private Long outletId;
    
    @Column(name = "total_quantity_sold")
    private Integer totalQuantitySold;
    
    @Column(name = "total_revenue", precision = 10, scale = 2)
    private BigDecimal totalRevenue;
    
    @Column(name = "average_price", precision = 10, scale = 2)
    private BigDecimal averagePrice;
    
    @Column(name = "stock_turnover_rate")
    private Double stockTurnoverRate;
    
    @Column(name = "analysis_date", nullable = false)
    private LocalDateTime analysisDate;
    
    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Manual setters for compatibility
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public void setOutletId(Long outletId) {
        this.outletId = outletId;
    }
    
    public void setTotalQuantitySold(Integer totalQuantitySold) {
        this.totalQuantitySold = totalQuantitySold;
    }
    
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    
    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }
    
    public void setStockTurnoverRate(Double stockTurnoverRate) {
        this.stockTurnoverRate = stockTurnoverRate;
    }
    
    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }
}
