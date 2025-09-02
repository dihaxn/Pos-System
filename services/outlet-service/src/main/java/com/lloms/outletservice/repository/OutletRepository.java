package com.lloms.outletservice.repository;

import com.lloms.outletservice.entity.Outlet;
import com.lloms.outletservice.entity.enums.OutletStatus;
import com.lloms.outletservice.entity.enums.OutletType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutletRepository extends MongoRepository<Outlet, String> {

    Optional<Outlet> findByName(String name);

    Optional<Outlet> findByCode(String code);

    List<Outlet> findByStatus(OutletStatus status);

    List<Outlet> findByType(OutletType type);

    List<Outlet> findByStatusAndType(OutletStatus status, OutletType type);

    List<Outlet> findByCity(String city);

    List<Outlet> findByState(String state);

    List<Outlet> findByCountry(String country);

    @Query("{ 'managerId': ?0 }")
    List<Outlet> findByManagerId(String managerId);

    @Query("{ 'cashierIds': { $in: [?0] } }")
    List<Outlet> findByCashierId(String cashierId);

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    Page<Outlet> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("{ 'city': { $regex: ?0, $options: 'i' } }")
    List<Outlet> findByCityContainingIgnoreCase(String city);

    @Query("{ 'status': ?0, 'type': ?1, 'city': { $regex: ?2, $options: 'i' } }")
    List<Outlet> findByStatusAndTypeAndCityContainingIgnoreCase(OutletStatus status, OutletType type, String city);

    @Query("{ 'latitude': { $gte: ?0, $lte: ?1 }, 'longitude': { $gte: ?2, $lte: ?3 } }")
    List<Outlet> findByLocationWithin(double minLat, double maxLat, double minLng, double maxLng);

    @Query("{ 'status': 'ACTIVE' }")
    List<Outlet> findActiveOutlets();

    @Query("{ 'status': 'ACTIVE', 'type': ?0 }")
    List<Outlet> findActiveOutletsByType(OutletType type);

    @Query(value = "{ 'status': ?0 }", count = true)
    long countByStatus(OutletStatus status);

    @Query(value = "{ 'type': ?0 }", count = true)
    long countByType(OutletType type);

    @Query(value = "{ 'city': ?0 }", count = true)
    long countByCity(String city);

    @Query(value = "{ 'state': ?0 }", count = true)
    long countByState(String state);
}
