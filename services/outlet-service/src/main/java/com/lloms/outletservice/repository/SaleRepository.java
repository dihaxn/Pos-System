package com.lloms.outletservice.repository;

import com.lloms.outletservice.entity.Sale;
import com.lloms.outletservice.entity.enums.PaymentMethod;
import com.lloms.outletservice.entity.enums.SaleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends MongoRepository<Sale, String> {

    Optional<Sale> findBySaleNumber(String saleNumber);

    List<Sale> findByOutletId(String outletId);

    List<Sale> findByCashierId(String cashierId);

    List<Sale> findByCustomerId(String customerId);

    List<Sale> findByStatus(SaleStatus status);

    List<Sale> findByPaymentMethod(PaymentMethod paymentMethod);

    List<Sale> findByOutletIdAndStatus(String outletId, SaleStatus status);

    List<Sale> findByCashierIdAndStatus(String cashierId, SaleStatus status);

    @Query("{ 'outletId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Sale> findByOutletIdAndCreatedAtBetween(String outletId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'cashierId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 } }")
    List<Sale> findByCashierIdAndCreatedAtBetween(String cashierId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    List<Sale> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'outletId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'status': 'COMPLETED' }")
    List<Sale> findCompletedSalesByOutletAndDateRange(String outletId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{ 'cashierId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'status': 'COMPLETED' }")
    List<Sale> findCompletedSalesByCashierAndDateRange(String cashierId, LocalDateTime startDate,
            LocalDateTime endDate);

    @Query(value = "{ 'outletId': ?0, 'status': 'COMPLETED' }", count = true)
    long countCompletedSalesByOutlet(String outletId);

    @Query(value = "{ 'cashierId': ?0, 'status': 'COMPLETED' }", count = true)
    long countCompletedSalesByCashier(String cashierId);

    @Query("{ 'outletId': ?0, 'status': 'COMPLETED' }")
    List<Sale> findCompletedSalesByOutlet(String outletId);

    @Query("{ 'cashierId': ?0, 'status': 'COMPLETED' }")
    List<Sale> findCompletedSalesByCashier(String cashierId);

    @Query("{ 'outletId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'status': 'COMPLETED' }")
    Page<Sale> findCompletedSalesByOutletAndDateRangePaged(String outletId, LocalDateTime startDate,
            LocalDateTime endDate, Pageable pageable);

    @Query("{ 'cashierId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'status': 'COMPLETED' }")
    Page<Sale> findCompletedSalesByCashierAndDateRangePaged(String cashierId, LocalDateTime startDate,
            LocalDateTime endDate, Pageable pageable);

    @Query(value = "{ 'outletId': ?0, 'status': 'COMPLETED' }", fields = "{ 'totalAmount': 1 }")
    List<Sale> findTotalAmountsByOutlet(String outletId);

    @Query(value = "{ 'cashierId': ?0, 'status': 'COMPLETED' }", fields = "{ 'totalAmount': 1 }")
    List<Sale> findTotalAmountsByCashier(String cashierId);

    @Query("{ 'outletId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'status': 'COMPLETED', 'totalAmount': { $gte: ?3 } }")
    List<Sale> findHighValueSalesByOutlet(String outletId, LocalDateTime startDate, LocalDateTime endDate,
            BigDecimal minAmount);

    @Query("{ 'cashierId': ?0, 'createdAt': { $gte: ?1, $lte: ?2 }, 'status': 'COMPLETED', 'totalAmount': { $gte: ?3 } }")
    List<Sale> findHighValueSalesByCashier(String cashierId, LocalDateTime startDate, LocalDateTime endDate,
            BigDecimal minAmount);
}
