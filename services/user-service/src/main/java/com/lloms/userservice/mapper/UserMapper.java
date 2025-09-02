package com.lloms.userservice.mapper;

import com.lloms.userservice.dto.response.UserResponse;
import com.lloms.userservice.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    private final ModelMapper modelMapper;
    
    public UserMapper() {
        this.modelMapper = new ModelMapper();
        configureMappings();
    }
    
    private void configureMappings() {
        modelMapper.createTypeMap(User.class, UserResponse.class)
                .addMappings(mapper -> {
                    mapper.map(User::getFullName, UserResponse::setFullName);
                });
    }
    
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return modelMapper.map(user, UserResponse.class);
    }
}
