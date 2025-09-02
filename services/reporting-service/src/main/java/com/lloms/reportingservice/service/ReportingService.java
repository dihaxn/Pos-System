package com.lloms.reportingservice.service;

import com.lloms.reportingservice.entity.ProductAnalytics;
import com.lloms.reportingservice.entity.SalesReport;

import java.time.LocalDateTime;
import java.util.List;

public interface ReportingService {
    
    // Sales Reports
    SalesReport generateDailySalesReport(Long outletId, LocalDateTime date);
    SalesReport generateWeeklySalesReport(Long outletId, LocalDateTime startDate);
    SalesReport generateMonthlySalesReport(Long outletId, LocalDateTime date);
    SalesReport generateYearlySalesReport(Long outletId, LocalDateTime date);
    
    List<SalesReport> getSalesReportsByOutlet(Long outletId, SalesReport.ReportType reportType);
    List<SalesReport> getSalesReportsByDateRange(LocalDateTime startDate, LocalDateTime endDate, SalesReport.ReportType reportType);
    List<SalesReport> getTopPerformingOutlets(SalesReport.ReportType reportType, int limit);
    
    // Product Analytics
    ProductAnalytics generateProductAnalytics(Long productId, Long outletId, LocalDateTime date);
    List<ProductAnalytics> getProductAnalyticsByOutlet(Long outletId, LocalDateTime startDate, LocalDateTime endDate);
    List<ProductAnalytics> getTopSellingProducts(Long outletId, int limit);
    List<ProductAnalytics> getTopProductsByCategory(String category, int limit);
    List<ProductAnalytics> getHighTurnoverProducts(Long outletId, LocalDateTime startDate);
    
    // Dashboard Data
    Object getDashboardSummary(Long outletId);
    Object getSalesTrends(Long outletId, LocalDateTime startDate, LocalDateTime endDate);
    Object getProductPerformanceMetrics(Long outletId, LocalDateTime startDate, LocalDateTime endDate);
}
