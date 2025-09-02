package com.lloms.reportingservice.controller;

import com.lloms.reportingservice.entity.ProductAnalytics;
import com.lloms.reportingservice.entity.SalesReport;
import com.lloms.reportingservice.service.ReportingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reporting Service", description = "APIs for sales reports and analytics")
public class ReportingController {
    
    private final ReportingService reportingService;
    
    @PostMapping("/sales/daily")
    @Operation(summary = "Generate daily sales report")
    public ResponseEntity<SalesReport> generateDailySalesReport(
            @RequestParam Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        log.info("Generating daily sales report for outlet: {} on date: {}", outletId, date);
        SalesReport report = reportingService.generateDailySalesReport(outletId, date);
        return ResponseEntity.ok(report);
    }
    
    @PostMapping("/sales/weekly")
    @Operation(summary = "Generate weekly sales report")
    public ResponseEntity<SalesReport> generateWeeklySalesReport(
            @RequestParam Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
        log.info("Generating weekly sales report for outlet: {} starting: {}", outletId, startDate);
        SalesReport report = reportingService.generateWeeklySalesReport(outletId, startDate);
        return ResponseEntity.ok(report);
    }
    
    @PostMapping("/sales/monthly")
    @Operation(summary = "Generate monthly sales report")
    public ResponseEntity<SalesReport> generateMonthlySalesReport(
            @RequestParam Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        log.info("Generating monthly sales report for outlet: {} for month: {}", outletId, date);
        SalesReport report = reportingService.generateMonthlySalesReport(outletId, date);
        return ResponseEntity.ok(report);
    }
    
    @PostMapping("/sales/yearly")
    @Operation(summary = "Generate yearly sales report")
    public ResponseEntity<SalesReport> generateYearlySalesReport(
            @RequestParam Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        log.info("Generating yearly sales report for outlet: {} for year: {}", outletId, date);
        SalesReport report = reportingService.generateYearlySalesReport(outletId, date);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/sales/outlet/{outletId}")
    @Operation(summary = "Get sales reports by outlet")
    public ResponseEntity<List<SalesReport>> getSalesReportsByOutlet(
            @PathVariable Long outletId,
            @RequestParam SalesReport.ReportType reportType) {
        log.info("Getting sales reports for outlet: {} with type: {}", outletId, reportType);
        List<SalesReport> reports = reportingService.getSalesReportsByOutlet(outletId, reportType);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/sales/date-range")
    @Operation(summary = "Get sales reports by date range")
    public ResponseEntity<List<SalesReport>> getSalesReportsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam SalesReport.ReportType reportType) {
        log.info("Getting sales reports from {} to {} with type: {}", startDate, endDate, reportType);
        List<SalesReport> reports = reportingService.getSalesReportsByDateRange(startDate, endDate, reportType);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/sales/top-performers")
    @Operation(summary = "Get top performing outlets")
    public ResponseEntity<List<SalesReport>> getTopPerformingOutlets(
            @RequestParam SalesReport.ReportType reportType,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Getting top {} performing outlets for report type: {}", limit, reportType);
        List<SalesReport> reports = reportingService.getTopPerformingOutlets(reportType, limit);
        return ResponseEntity.ok(reports);
    }
    
    @PostMapping("/analytics/product")
    @Operation(summary = "Generate product analytics")
    public ResponseEntity<ProductAnalytics> generateProductAnalytics(
            @RequestParam Long productId,
            @RequestParam Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        log.info("Generating product analytics for product: {} at outlet: {} on date: {}", productId, outletId, date);
        ProductAnalytics analytics = reportingService.generateProductAnalytics(productId, outletId, date);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/outlet/{outletId}")
    @Operation(summary = "Get product analytics by outlet")
    public ResponseEntity<List<ProductAnalytics>> getProductAnalyticsByOutlet(
            @PathVariable Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Getting product analytics for outlet: {} from {} to {}", outletId, startDate, endDate);
        List<ProductAnalytics> analytics = reportingService.getProductAnalyticsByOutlet(outletId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/top-selling/{outletId}")
    @Operation(summary = "Get top selling products by outlet")
    public ResponseEntity<List<ProductAnalytics>> getTopSellingProducts(
            @PathVariable Long outletId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Getting top {} selling products for outlet: {}", limit, outletId);
        List<ProductAnalytics> analytics = reportingService.getTopSellingProducts(outletId, limit);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/category/{category}")
    @Operation(summary = "Get top products by category")
    public ResponseEntity<List<ProductAnalytics>> getTopProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Getting top {} products for category: {}", limit, category);
        List<ProductAnalytics> analytics = reportingService.getTopProductsByCategory(category, limit);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/high-turnover/{outletId}")
    @Operation(summary = "Get high turnover products")
    public ResponseEntity<List<ProductAnalytics>> getHighTurnoverProducts(
            @PathVariable Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
        log.info("Getting high turnover products for outlet: {} since {}", outletId, startDate);
        List<ProductAnalytics> analytics = reportingService.getHighTurnoverProducts(outletId, startDate);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/dashboard/{outletId}")
    @Operation(summary = "Get dashboard summary")
    public ResponseEntity<Object> getDashboardSummary(@PathVariable Long outletId) {
        log.info("Getting dashboard summary for outlet: {}", outletId);
        Object summary = reportingService.getDashboardSummary(outletId);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/trends/{outletId}")
    @Operation(summary = "Get sales trends")
    public ResponseEntity<Object> getSalesTrends(
            @PathVariable Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Getting sales trends for outlet: {} from {} to {}", outletId, startDate, endDate);
        Object trends = reportingService.getSalesTrends(outletId, startDate, endDate);
        return ResponseEntity.ok(trends);
    }
    
    @GetMapping("/performance/{outletId}")
    @Operation(summary = "Get product performance metrics")
    public ResponseEntity<Object> getProductPerformanceMetrics(
            @PathVariable Long outletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Getting product performance metrics for outlet: {} from {} to {}", outletId, startDate, endDate);
        Object metrics = reportingService.getProductPerformanceMetrics(outletId, startDate, endDate);
        return ResponseEntity.ok(metrics);
    }
}
