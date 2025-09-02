package com.lloms.productservice.repository;

import com.lloms.productservice.entity.Category;
import com.lloms.productservice.entity.enums.CategoryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find category by name
     */
    Optional<Category> findByNameAndDeletedFalse(String name);

    /**
     * Find root categories (no parent)
     */
    List<Category> findByParentIsNullAndDeletedFalseOrderBySortOrderAsc();

    /**
     * Find categories by parent
     */
    List<Category> findByParentIdAndDeletedFalseOrderBySortOrderAsc(Long parentId);

    /**
     * Find categories by status
     */
    Page<Category> findByStatusAndDeletedFalse(CategoryStatus status, Pageable pageable);

    /**
     * Find categories by name containing (case insensitive)
     */
    Page<Category> findByNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);

    /**
     * Check if category name exists (excluding current category)
     */
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE c.name = :name AND c.deleted = false AND (:id IS NULL OR c.id != :id)")
    boolean existsByNameAndIdNot(@Param("name") String name, @Param("id") Long id);

    /**
     * Get category hierarchy
     */
    @Query("SELECT c FROM Category c WHERE c.deleted = false ORDER BY c.parent.id NULLS FIRST, c.sortOrder ASC")
    List<Category> findAllOrderedByHierarchy();

    /**
     * Find categories with products
     */
    @Query("SELECT DISTINCT c FROM Category c JOIN c.products p WHERE c.deleted = false AND p.deleted = false")
    List<Category> findCategoriesWithProducts();

    /**
     * Get category count by parent
     */
    @Query("SELECT COUNT(c) FROM Category c WHERE c.parent.id = :parentId AND c.deleted = false")
    long countByParentId(@Param("parentId") Long parentId);
}
