package com.lloms.reportingservice.repository;

import com.lloms.reportingservice.entity.SalesReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesReportRepository extends JpaRepository<SalesReport, Long> {
    
    List<SalesReport> findByOutletIdAndReportType(Long outletId, SalesReport.ReportType reportType);
    
    List<SalesReport> findByReportDateBetweenAndReportType(
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        SalesReport.ReportType reportType
    );
    
    @Query("SELECT sr FROM SalesReport sr WHERE sr.outletId = :outletId AND sr.reportDate >= :startDate AND sr.reportDate <= :endDate ORDER BY sr.reportDate DESC")
    List<SalesReport> findByOutletIdAndDateRange(
        @Param("outletId") Long outletId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT sr FROM SalesReport sr WHERE sr.reportType = :reportType ORDER BY sr.totalSales DESC")
    List<SalesReport> findTopPerformersByReportType(@Param("reportType") SalesReport.ReportType reportType);
}
