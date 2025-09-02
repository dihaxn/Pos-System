package com.lloms.productservice.repository;

import com.lloms.productservice.entity.Outlet;
import com.lloms.productservice.entity.enums.OutletStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Outlet entity
 */
@Repository
public interface OutletRepository extends JpaRepository<Outlet, Long> {

    /**
     * Find outlet by code
     */
    Optional<Outlet> findByCode(String code);

    /**
     * Check if outlet code exists
     */
    boolean existsByCode(String code);
}
