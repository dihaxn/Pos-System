package com.lloms.reportingservice.service.impl;

import com.lloms.reportingservice.entity.ProductAnalytics;
import com.lloms.reportingservice.entity.SalesReport;
import com.lloms.reportingservice.repository.ProductAnalyticsRepository;
import com.lloms.reportingservice.repository.SalesReportRepository;
import com.lloms.reportingservice.service.ReportingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ReportingServiceImpl implements ReportingService {
    
    private static final Logger log = LoggerFactory.getLogger(ReportingServiceImpl.class);
    private final SalesReportRepository salesReportRepository;
    private final ProductAnalyticsRepository productAnalyticsRepository;
    
    public ReportingServiceImpl(SalesReportRepository salesReportRepository, ProductAnalyticsRepository productAnalyticsRepository) {
        this.salesReportRepository = salesReportRepository;
        this.productAnalyticsRepository = productAnalyticsRepository;
    }
    
    @Override
    public SalesReport generateDailySalesReport(Long outletId, LocalDateTime date) {
        log.info("Generating daily sales report for outlet: {} on date: {}", outletId, date);
        
        // Mock data for demonstration
        SalesReport report = new SalesReport();
        report.setOutletId(outletId);
        report.setOutletName("Main Branch");
        report.setReportDate(date);
        report.setTotalSales(new BigDecimal("1250.50"));
        report.setTotalOrders(45);
        report.setTotalItemsSold(120);
        report.setAverageOrderValue(new BigDecimal("27.79"));
        report.setTopSellingProduct("Traditional Curry Powder");
        report.setTopSellingCategory("Spices");
        report.setReportType(SalesReport.ReportType.DAILY);
        
        return salesReportRepository.save(report);
    }
    
    @Override
    public SalesReport generateWeeklySalesReport(Long outletId, LocalDateTime startDate) {
        log.info("Generating weekly sales report for outlet: {} starting: {}", outletId, startDate);
        
        SalesReport report = new SalesReport();
        report.setOutletId(outletId);
        report.setOutletName("Main Branch");
        report.setReportDate(startDate);
        report.setTotalSales(new BigDecimal("8750.25"));
        report.setTotalOrders(315);
        report.setTotalItemsSold(840);
        report.setAverageOrderValue(new BigDecimal("27.78"));
        report.setTopSellingProduct("Ceylon Tea");
        report.setTopSellingCategory("Beverages");
        report.setReportType(SalesReport.ReportType.WEEKLY);
        
        return salesReportRepository.save(report);
    }
    
    @Override
    public SalesReport generateMonthlySalesReport(Long outletId, LocalDateTime date) {
        log.info("Generating monthly sales report for outlet: {} for month: {}", outletId, date);
        
        SalesReport report = new SalesReport();
        report.setOutletId(outletId);
        report.setOutletName("Main Branch");
        report.setReportDate(date);
        report.setTotalSales(new BigDecimal("37500.75"));
        report.setTotalOrders(1350);
        report.setTotalItemsSold(3600);
        report.setAverageOrderValue(new BigDecimal("27.78"));
        report.setTopSellingProduct("Traditional Curry Powder");
        report.setTopSellingCategory("Spices");
        report.setReportType(SalesReport.ReportType.MONTHLY);
        
        return salesReportRepository.save(report);
    }
    
    @Override
    public SalesReport generateYearlySalesReport(Long outletId, LocalDateTime date) {
        log.info("Generating yearly sales report for outlet: {} for year: {}", outletId, date);
        
        SalesReport report = new SalesReport();
        report.setOutletId(outletId);
        report.setOutletName("Main Branch");
        report.setReportDate(date);
        report.setTotalSales(new BigDecimal("450000.00"));
        report.setTotalOrders(16200);
        report.setTotalItemsSold(43200);
        report.setAverageOrderValue(new BigDecimal("27.78"));
        report.setTopSellingProduct("Traditional Curry Powder");
        report.setTopSellingCategory("Spices");
        report.setReportType(SalesReport.ReportType.YEARLY);
        
        return salesReportRepository.save(report);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SalesReport> getSalesReportsByOutlet(Long outletId, SalesReport.ReportType reportType) {
        return salesReportRepository.findByOutletIdAndReportType(outletId, reportType);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SalesReport> getSalesReportsByDateRange(LocalDateTime startDate, LocalDateTime endDate, SalesReport.ReportType reportType) {
        return salesReportRepository.findByReportDateBetweenAndReportType(startDate, endDate, reportType);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SalesReport> getTopPerformingOutlets(SalesReport.ReportType reportType, int limit) {
        return salesReportRepository.findTopPerformersByReportType(reportType)
                .stream()
                .limit(limit)
                .toList();
    }
    
    @Override
    public ProductAnalytics generateProductAnalytics(Long productId, Long outletId, LocalDateTime date) {
        log.info("Generating product analytics for product: {} at outlet: {} on date: {}", productId, outletId, date);
        
        ProductAnalytics analytics = new ProductAnalytics();
        analytics.setProductId(productId);
        analytics.setProductName("Traditional Curry Powder");
        analytics.setCategory("Spices");
        analytics.setOutletId(outletId);
        analytics.setTotalQuantitySold(150);
        analytics.setTotalRevenue(new BigDecimal("2398.50"));
        analytics.setAveragePrice(new BigDecimal("15.99"));
        analytics.setStockTurnoverRate(2.5);
        analytics.setAnalysisDate(date);
        
        return productAnalyticsRepository.save(analytics);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductAnalytics> getProductAnalyticsByOutlet(Long outletId, LocalDateTime startDate, LocalDateTime endDate) {
        return productAnalyticsRepository.findByOutletIdAndAnalysisDateBetween(outletId, startDate, endDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductAnalytics> getTopSellingProducts(Long outletId, int limit) {
        return productAnalyticsRepository.findTopSellingProductsByOutlet(outletId)
                .stream()
                .limit(limit)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductAnalytics> getTopProductsByCategory(String category, int limit) {
        return productAnalyticsRepository.findTopProductsByCategory(category)
                .stream()
                .limit(limit)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductAnalytics> getHighTurnoverProducts(Long outletId, LocalDateTime startDate) {
        return productAnalyticsRepository.findHighTurnoverProducts(outletId, startDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Object getDashboardSummary(Long outletId) {
        Map<String, Object> summary = new HashMap<>();
        
        // Mock dashboard data
        summary.put("totalSales", new BigDecimal("1250.50"));
        summary.put("totalOrders", 45);
        summary.put("totalCustomers", 38);
        summary.put("averageOrderValue", new BigDecimal("27.79"));
        summary.put("topSellingProduct", "Traditional Curry Powder");
        summary.put("salesGrowth", 12.5);
        summary.put("orderGrowth", 8.3);
        
        return summary;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Object getSalesTrends(Long outletId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> trends = new HashMap<>();
        
        // Mock trend data
        trends.put("period", "Daily");
        trends.put("startDate", startDate);
        trends.put("endDate", endDate);
        trends.put("totalSales", new BigDecimal("8750.25"));
        trends.put("salesGrowth", 12.5);
        trends.put("orderGrowth", 8.3);
        trends.put("trendDirection", "UP");
        
        return trends;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Object getProductPerformanceMetrics(Long outletId, LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Mock performance metrics
        metrics.put("totalProducts", 25);
        metrics.put("topPerformingCategory", "Spices");
        metrics.put("averageStockTurnover", 2.5);
        metrics.put("lowStockProducts", 3);
        metrics.put("outOfStockProducts", 1);
        
        return metrics;
    }
}
