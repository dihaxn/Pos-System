package com.lloms.productservice.controller;

import com.lloms.productservice.dto.request.CreateProductRequest;
import com.lloms.productservice.dto.request.UpdateProductRequest;
import com.lloms.productservice.dto.response.ProductResponse;
import com.lloms.productservice.entity.enums.ProductStatus;
import com.lloms.productservice.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST Controller for Product operations
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Create a new product", description = "Creates a new product in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Product with SKU/barcode already exists"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            Authentication authentication) {

        log.info("Creating product: {} by user: {}", request.getName(), authentication.getName());

        ProductResponse response = productService.createProduct(request, authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update a product", description = "Updates an existing product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "409", description = "Product with SKU/barcode already exists"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ProductResponse> updateProduct(
            @Parameter(description = "Product ID") @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request,
            Authentication authentication) {

        log.info("Updating product ID: {} by user: {}", id, authentication.getName());

        ProductResponse response = productService.updateProduct(id, request, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get product by ID", description = "Retrieves a product by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ProductResponse> getProductById(
            @Parameter(description = "Product ID") @PathVariable Long id) {

        log.debug("Getting product by ID: {}", id);

        ProductResponse response = productService.getProductById(id);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sku/{sku}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get product by SKU", description = "Retrieves a product by its SKU")
    public ResponseEntity<ProductResponse> getProductBySku(
            @Parameter(description = "Product SKU") @PathVariable String sku) {

        log.debug("Getting product by SKU: {}", sku);

        ProductResponse response = productService.getProductBySku(sku);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/barcode/{barcode}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get product by barcode", description = "Retrieves a product by its barcode")
    public ResponseEntity<ProductResponse> getProductByBarcode(
            @Parameter(description = "Product barcode") @PathVariable String barcode) {

        log.debug("Getting product by barcode: {}", barcode);

        ProductResponse response = productService.getProductByBarcode(barcode);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get all products", description = "Retrieves all products with pagination")
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Getting all products with pagination: {}", pageable);

        Page<ProductResponse> response = productService.getAllProducts(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get products by category", description = "Retrieves products by category ID")
    public ResponseEntity<Page<ProductResponse>> getProductsByCategory(
            @Parameter(description = "Category ID") @PathVariable Long categoryId,
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Getting products by category ID: {}", categoryId);

        Page<ProductResponse> response = productService.getProductsByCategory(categoryId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/outlet/{outletId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get products by outlet", description = "Retrieves products by outlet ID")
    public ResponseEntity<Page<ProductResponse>> getProductsByOutlet(
            @Parameter(description = "Outlet ID") @PathVariable Long outletId,
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Getting products by outlet ID: {}", outletId);

        Page<ProductResponse> response = productService.getProductsByOutlet(outletId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get products by status", description = "Retrieves products by status")
    public ResponseEntity<Page<ProductResponse>> getProductsByStatus(
            @Parameter(description = "Product status") @PathVariable ProductStatus status,
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Getting products by status: {}", status);

        Page<ProductResponse> response = productService.getProductsByStatus(status, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Search products by name", description = "Searches products by name")
    public ResponseEntity<Page<ProductResponse>> searchProductsByName(
            @Parameter(description = "Product name to search") @RequestParam String name,
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Searching products by name: {}", name);

        Page<ProductResponse> response = productService.searchProductsByName(name, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/price-range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get products by price range", description = "Retrieves products within a price range")
    public ResponseEntity<Page<ProductResponse>> getProductsByPriceRange(
            @Parameter(description = "Minimum price") @RequestParam BigDecimal minPrice,
            @Parameter(description = "Maximum price") @RequestParam BigDecimal maxPrice,
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Getting products by price range: {} - {}", minPrice, maxPrice);

        Page<ProductResponse> response = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/criteria")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('CASHIER')")
    @Operation(summary = "Get products by multiple criteria", description = "Retrieves products by multiple search criteria")
    public ResponseEntity<Page<ProductResponse>> getProductsByCriteria(
            @Parameter(description = "Category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Outlet ID") @RequestParam(required = false) Long outletId,
            @Parameter(description = "Product status") @RequestParam(required = false) ProductStatus status,
            @Parameter(description = "Product name") @RequestParam(required = false) String name,
            @PageableDefault(size = 20) Pageable pageable) {

        log.debug("Getting products by criteria - categoryId: {}, outletId: {}, status: {}, name: {}",
                categoryId, outletId, status, name);

        Page<ProductResponse> response = productService.getProductsByCriteria(categoryId, outletId, status, name,
                pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get low stock products", description = "Retrieves products with low stock levels")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts() {

        log.debug("Getting low stock products");

        List<ProductResponse> response = productService.getLowStockProducts();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/out-of-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get out of stock products", description = "Retrieves products that are out of stock")
    public ResponseEntity<List<ProductResponse>> getOutOfStockProducts() {

        log.debug("Getting out of stock products");

        List<ProductResponse> response = productService.getOutOfStockProducts();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update product stock", description = "Updates the stock quantity of a product")
    public ResponseEntity<ProductResponse> updateStock(
            @Parameter(description = "Product ID") @PathVariable Long id,
            @Parameter(description = "Stock quantity change") @RequestParam Integer quantity,
            @Parameter(description = "Reason for stock change") @RequestParam String reason,
            Authentication authentication) {

        log.info("Updating stock for product ID: {} by quantity: {} by user: {}",
                id, quantity, authentication.getName());

        ProductResponse response = productService.updateStock(id, quantity, reason, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/price")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update product price", description = "Updates the price of a product")
    public ResponseEntity<ProductResponse> updatePrice(
            @Parameter(description = "Product ID") @PathVariable Long id,
            @Parameter(description = "New price") @RequestParam BigDecimal newPrice,
            @Parameter(description = "Reason for price change") @RequestParam String reason,
            Authentication authentication) {

        log.info("Updating price for product ID: {} to: {} by user: {}",
                id, newPrice, authentication.getName());

        ProductResponse response = productService.updatePrice(id, newPrice, reason, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Change product status", description = "Changes the status of a product")
    public ResponseEntity<ProductResponse> changeStatus(
            @Parameter(description = "Product ID") @PathVariable Long id,
            @Parameter(description = "New status") @RequestParam ProductStatus status,
            Authentication authentication) {

        log.info("Changing status for product ID: {} to: {} by user: {}",
                id, status, authentication.getName());

        ProductResponse response = productService.changeStatus(id, status, authentication.getName());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product", description = "Soft deletes a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product ID") @PathVariable Long id,
            Authentication authentication) {

        log.info("Deleting product ID: {} by user: {}", id, authentication.getName());

        productService.deleteProduct(id, authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/inventory-report")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Get inventory report", description = "Generates an inventory report for products")
    public ResponseEntity<List<ProductResponse>> getInventoryReport(
            @Parameter(description = "Outlet ID (optional)") @RequestParam(required = false) Long outletId) {

        log.debug("Getting inventory report for outlet ID: {}", outletId);

        List<ProductResponse> response = productService.getInventoryReport(outletId);

        return ResponseEntity.ok(response);
    }
}
