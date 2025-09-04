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
@Table(name = "sales_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SalesReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "outlet_id", nullable = false)
    private Long outletId;
    
    @Column(name = "outlet_name")
    private String outletName;
    
    @Column(name = "report_date", nullable = false)
    private LocalDateTime reportDate;
    
    @Column(name = "total_sales", precision = 10, scale = 2)
    private BigDecimal totalSales;
    
    @Column(name = "total_orders")
    private Integer totalOrders;
    
    @Column(name = "total_items_sold")
    private Integer totalItemsSold;
    
    @Column(name = "average_order_value", precision = 10, scale = 2)
    private BigDecimal averageOrderValue;
    
    @Column(name = "top_selling_product")
    private String topSellingProduct;
    
    @Column(name = "top_selling_category")
    private String topSellingCategory;
    
    @Column(name = "report_type")
    @Enumerated(EnumType.STRING)
    private ReportType reportType;
    
    @Column(name = "created_at", updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum ReportType {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }
    
    // Manual setters for compatibility
    public void setOutletId(Long outletId) {
        this.outletId = outletId;
    }
    
    public void setOutletName(String outletName) {
        this.outletName = outletName;
    }
    
    public void setReportDate(LocalDateTime reportDate) {
        this.reportDate = reportDate;
    }
    
    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }
    
    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }
    
    public void setTotalItemsSold(Integer totalItemsSold) {
        this.totalItemsSold = totalItemsSold;
    }
    
    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }
    
    public void setTopSellingProduct(String topSellingProduct) {
        this.topSellingProduct = topSellingProduct;
    }
    
    public void setTopSellingCategory(String topSellingCategory) {
        this.topSellingCategory = topSellingCategory;
    }
    
    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }
}
