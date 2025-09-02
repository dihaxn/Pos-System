package com.lloms.productservice.mapper;

import com.lloms.productservice.dto.response.ProductResponse;
import com.lloms.productservice.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

/**
 * Mapper interface for Product entity and DTOs
 */
@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "outletId", source = "outlet.id")
    @Mapping(target = "outletName", source = "outlet.name")
    @Mapping(target = "profitMargin", source = ".", qualifiedByName = "calculateProfitMargin")
    @Mapping(target = "taxAmount", source = ".", qualifiedByName = "calculateTaxAmount")
    @Mapping(target = "priceWithTax", source = ".", qualifiedByName = "calculatePriceWithTax")
    @Mapping(target = "isLowStock", source = ".", qualifiedByName = "isLowStock")
    @Mapping(target = "isOutOfStock", source = ".", qualifiedByName = "isOutOfStock")
    ProductResponse toResponse(Product product);

    @Named("calculateProfitMargin")
    default java.math.BigDecimal calculateProfitMargin(Product product) {
        return product.calculateProfitMargin();
    }

    @Named("calculateTaxAmount")
    default java.math.BigDecimal calculateTaxAmount(Product product) {
        return product.calculateTaxAmount();
    }

    @Named("calculatePriceWithTax")
    default java.math.BigDecimal calculatePriceWithTax(Product product) {
        return product.getPriceWithTax();
    }

    @Named("isLowStock")
    default Boolean isLowStock(Product product) {
        return product.isLowStock();
    }

    @Named("isOutOfStock")
    default Boolean isOutOfStock(Product product) {
        return product.isOutOfStock();
    }
}
