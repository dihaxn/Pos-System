package com.LittleLanka.productservice.util.functions;

import com.lloms.productservice.dto.paginated.PaginatedResponseGetAllProductsDTO;
import com.lloms.productservice.dto.response.ResponseGetAllProductsDTO;
import com.lloms.productservice.entity.Product;
import com.lloms.productservice.repository.PriceUpdateRepository;
import com.lloms.productservice.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class ServiceFuntions {
    @Autowired
    private PriceUpdateRepository priceUpdateRepository;
    @Autowired
    private ModelMapper modelMapper;

    public Date makeDate(String date){
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date dateObj = null;
        try {
            dateObj = formatter.parse(date);
        }catch (Exception e){
            e.printStackTrace();
        }
        return dateObj;
    }

    public PaginatedResponseGetAllProductsDTO getResponseGetAllProductsDTOS(Page<Product> products) {
        List<ResponseGetAllProductsDTO> responseList = new ArrayList<>();

        for (Product product : products) {
            ResponseGetAllProductsDTO productDTO = modelMapper.map(product, ResponseGetAllProductsDTO.class);
            Double price = priceUpdateRepository.findPriceUpdateByPriceUpdateDateAndProductId(new Date(), product.getProductId());
            productDTO.setPrice(price);
            responseList.add(productDTO);
        }

        return new PaginatedResponseGetAllProductsDTO(responseList, products.getTotalElements());
    }
}
