package com.lloms.productservice.dto.paginated;

import com.lloms.productservice.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for paginated product response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponseGetAllProductsDTO {
    private List<Product> products;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
}
