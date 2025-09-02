package com.lloms.productservice.service.impl;

import com.lloms.productservice.dto.request.CreateProductRequest;
import com.lloms.productservice.dto.request.UpdateProductRequest;
import com.lloms.productservice.dto.response.ProductResponse;
import com.lloms.productservice.entity.Category;
import com.lloms.productservice.entity.Outlet;
import com.lloms.productservice.entity.PriceHistory;
import com.lloms.productservice.entity.Product;
import com.lloms.productservice.entity.StockMovement;
import com.lloms.productservice.entity.enums.ProductStatus;
import com.lloms.productservice.entity.enums.StockMovementType;
import com.lloms.productservice.exception.CategoryNotFoundException;
import com.lloms.productservice.exception.DuplicateProductException;
import com.lloms.productservice.exception.OutletNotFoundException;
import com.lloms.productservice.exception.ProductNotFoundException;
import com.lloms.productservice.mapper.ProductMapper;
import com.lloms.productservice.repository.CategoryRepository;
import com.lloms.productservice.repository.OutletRepository;
import com.lloms.productservice.repository.ProductRepository;
import com.lloms.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of ProductService
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OutletRepository outletRepository;
    private final ProductMapper productMapper;

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse createProduct(CreateProductRequest request, String createdBy) {
        log.info("Creating product: {}", request.getName());

        // Validate SKU uniqueness
        if (request.getSku() != null && existsBySku(request.getSku(), null)) {
            throw new DuplicateProductException("Product with SKU " + request.getSku() + " already exists");
        }

        // Validate barcode uniqueness
        if (request.getBarcode() != null && existsByBarcode(request.getBarcode(), null)) {
            throw new DuplicateProductException("Product with barcode " + request.getBarcode() + " already exists");
        }

        // Validate category exists
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new CategoryNotFoundException("Category not found with id: " + request.getCategoryId()));

        // Validate outlet exists
        Outlet outlet = outletRepository.findById(request.getOutletId())
                .orElseThrow(() -> new OutletNotFoundException("Outlet not found with id: " + request.getOutletId()));

        // Create product
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .costPrice(request.getCostPrice())
                .stockQuantity(request.getStockQuantity())
                .minStockLevel(request.getMinStockLevel())
                .sku(request.getSku())
                .barcode(request.getBarcode())
                .category(category)
                .outlet(outlet)
                .imageUrl(request.getImageUrl())
                .weight(request.getWeight())
                .unit(request.getUnit())
                .isTaxable(request.getIsTaxable())
                .taxRate(request.getTaxRate())
                .createdBy(createdBy)
                .build();

        // Set status based on stock
        if (product.getStockQuantity() <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.isLowStock()) {
            product.setStatus(ProductStatus.LOW_STOCK);
        }

        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with ID: {}", savedProduct.getId());

        return productMapper.toResponse(savedProduct);
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateProduct(Long id, UpdateProductRequest request, String updatedBy) {
        log.info("Updating product with ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        // Validate SKU uniqueness if changed
        if (request.getSku() != null && !request.getSku().equals(product.getSku()) &&
                existsBySku(request.getSku(), id)) {
            throw new DuplicateProductException("Product with SKU " + request.getSku() + " already exists");
        }

        // Validate barcode uniqueness if changed
        if (request.getBarcode() != null && !request.getBarcode().equals(product.getBarcode()) &&
                existsByBarcode(request.getBarcode(), id)) {
            throw new DuplicateProductException("Product with barcode " + request.getBarcode() + " already exists");
        }

        // Update fields
        if (request.getName() != null)
            product.setName(request.getName());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getSku() != null)
            product.setSku(request.getSku());
        if (request.getBarcode() != null)
            product.setBarcode(request.getBarcode());
        if (request.getImageUrl() != null)
            product.setImageUrl(request.getImageUrl());
        if (request.getWeight() != null)
            product.setWeight(request.getWeight());
        if (request.getUnit() != null)
            product.setUnit(request.getUnit());
        if (request.getIsTaxable() != null)
            product.setIsTaxable(request.getIsTaxable());
        if (request.getTaxRate() != null)
            product.setTaxRate(request.getTaxRate());
        if (request.getMinStockLevel() != null)
            product.setMinStockLevel(request.getMinStockLevel());

        // Handle price update
        if (request.getPrice() != null && !request.getPrice().equals(product.getPrice())) {
            createPriceHistory(product, request.getPrice(), "Price updated", updatedBy);
            product.setPrice(request.getPrice());
        }

        // Handle cost price update
        if (request.getCostPrice() != null) {
            product.setCostPrice(request.getCostPrice());
        }

        // Handle stock update
        if (request.getStockQuantity() != null && !request.getStockQuantity().equals(product.getStockQuantity())) {
            int quantityChange = request.getStockQuantity() - product.getStockQuantity();
            updateStockInternal(product, quantityChange, "Stock updated", updatedBy);
        }

        // Handle category update
        if (request.getCategoryId() != null && !request.getCategoryId().equals(product.getCategory().getId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CategoryNotFoundException(
                            "Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.setUpdatedBy(updatedBy);
        Product updatedProduct = productRepository.save(product);
        log.info("Product updated successfully with ID: {}", updatedProduct.getId());

        return productMapper.toResponse(updatedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        log.debug("Getting product by ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'sku:' + #sku")
    public ProductResponse getProductBySku(String sku) {
        log.debug("Getting product by SKU: {}", sku);

        Product product = productRepository.findBySkuAndDeletedFalse(sku)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with SKU: " + sku));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "products", key = "'barcode:' + #barcode")
    public ProductResponse getProductByBarcode(String barcode) {
        log.debug("Getting product by barcode: {}", barcode);

        Product product = productRepository.findByBarcodeAndDeletedFalse(barcode)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with barcode: " + barcode));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        log.debug("Getting all products with pagination: {}", pageable);

        Page<Product> products = productRepository.findAll(pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        log.debug("Getting products by category ID: {}", categoryId);

        Page<Product> products = productRepository.findByCategoryIdAndDeletedFalse(categoryId, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByOutlet(Long outletId, Pageable pageable) {
        log.debug("Getting products by outlet ID: {}", outletId);

        Page<Product> products = productRepository.findByOutletIdAndDeletedFalse(outletId, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable) {
        log.debug("Getting products by status: {}", status);

        Page<Product> products = productRepository.findByStatusAndDeletedFalse(status, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProductsByName(String name, Pageable pageable) {
        log.debug("Searching products by name: {}", name);

        Page<Product> products = productRepository.findByNameContainingIgnoreCaseAndDeletedFalse(name, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        log.debug("Getting products by price range: {} - {}", minPrice, maxPrice);

        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCriteria(Long categoryId, Long outletId, ProductStatus status,
            String name, Pageable pageable) {
        log.debug("Getting products by criteria - categoryId: {}, outletId: {}, status: {}, name: {}",
                categoryId, outletId, status, name);

        Page<Product> products = productRepository.findByCriteria(categoryId, outletId, status, name, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStockProducts() {
        log.debug("Getting low stock products");

        List<Product> products = productRepository.findLowStockProducts();
        return products.stream().map(productMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getOutOfStockProducts() {
        log.debug("Getting out of stock products");

        List<Product> products = productRepository.findOutOfStockProducts();
        return products.stream().map(productMapper::toResponse).toList();
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updateStock(Long id, Integer quantity, String reason, String updatedBy) {
        log.info("Updating stock for product ID: {} by quantity: {}", id, quantity);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        updateStockInternal(product, quantity, reason, updatedBy);

        Product updatedProduct = productRepository.save(product);
        log.info("Stock updated successfully for product ID: {}", id);

        return productMapper.toResponse(updatedProduct);
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse updatePrice(Long id, BigDecimal newPrice, String reason, String updatedBy) {
        log.info("Updating price for product ID: {} to: {}", id, newPrice);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        createPriceHistory(product, newPrice, reason, updatedBy);
        product.setPrice(newPrice);
        product.setUpdatedBy(updatedBy);

        Product updatedProduct = productRepository.save(product);
        log.info("Price updated successfully for product ID: {}", id);

        return productMapper.toResponse(updatedProduct);
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public ProductResponse changeStatus(Long id, ProductStatus status, String updatedBy) {
        log.info("Changing status for product ID: {} to: {}", id, status);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        product.setStatus(status);
        product.setUpdatedBy(updatedBy);

        Product updatedProduct = productRepository.save(product);
        log.info("Status changed successfully for product ID: {}", id);

        return productMapper.toResponse(updatedProduct);
    }

    @Override
    @CacheEvict(value = "products", allEntries = true)
    public void deleteProduct(Long id, String deletedBy) {
        log.info("Deleting product with ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));

        product.setDeleted(true);
        product.setUpdatedBy(deletedBy);

        productRepository.save(product);
        log.info("Product deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsBySku(String sku, Long excludeId) {
        return productRepository.existsBySkuAndIdNot(sku, excludeId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByBarcode(String barcode, Long excludeId) {
        return productRepository.existsByBarcodeAndIdNot(barcode, excludeId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getProductCountByCategory(Long categoryId) {
        return productRepository.countByCategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getProductCountByOutlet(Long outletId) {
        return productRepository.countByOutletId(outletId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getInventoryReport(Long outletId) {
        log.debug("Getting inventory report for outlet ID: {}", outletId);

        List<Product> products = productRepository.findForInventoryReport(outletId);
        return products.stream().map(productMapper::toResponse).toList();
    }

    // Private helper methods
    private void updateStockInternal(Product product, Integer quantity, String reason, String updatedBy) {
        product.updateStock(quantity, reason);

        // Update status based on stock level
        if (product.getStockQuantity() <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.isLowStock()) {
            product.setStatus(ProductStatus.LOW_STOCK);
        } else {
            product.setStatus(ProductStatus.ACTIVE);
        }

        product.setUpdatedBy(updatedBy);
    }

    private void createPriceHistory(Product product, BigDecimal newPrice, String reason, String updatedBy) {
        PriceHistory priceHistory = PriceHistory.builder()
                .product(product)
                .previousPrice(product.getPrice())
                .newPrice(newPrice)
                .effectiveDate(LocalDateTime.now())
                .reason(reason)
                .changedBy(updatedBy)
                .build();

        product.getPriceHistories().add(priceHistory);
    }
}
