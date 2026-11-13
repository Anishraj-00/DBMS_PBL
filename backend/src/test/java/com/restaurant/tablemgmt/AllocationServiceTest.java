package com.restaurant.tablemgmt;

import com.restaurant.tablemgmt.dto.AllocationRequestDTO;
import com.restaurant.tablemgmt.dto.SessionResponseDTO;
import com.restaurant.tablemgmt.entity.Customer;
import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.entity.enums.TableZone;
import com.restaurant.tablemgmt.exception.TableAlreadyOccupiedException;
import com.restaurant.tablemgmt.repository.CustomerRepository;
import com.restaurant.tablemgmt.repository.OccupancySessionRepository;
import com.restaurant.tablemgmt.repository.RestaurantTableRepository;
import com.restaurant.tablemgmt.service.AllocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AllocationServiceTest {

    @Autowired
    private AllocationService allocationService;

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OccupancySessionRepository sessionRepository;

    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();
        tableRepository.deleteAll();
        customerRepository.deleteAll();

        testCustomer = customerRepository.save(new Customer("Test Guest", "+91 9000000001", "VIP"));
    }

    @Test
    @DisplayName("Best-Fit Algorithm: Party of 3 is assigned 4-seater table instead of 8-seater")
    void testBestFitAllocation() {
        // Arrange: Create tables of capacity 2, 4, 8
        RestaurantTable t2 = tableRepository.save(new RestaurantTable("T-2", 2, TableZone.MAIN_HALL));
        RestaurantTable t4 = tableRepository.save(new RestaurantTable("T-4", 4, TableZone.MAIN_HALL));
        RestaurantTable t8 = tableRepository.save(new RestaurantTable("T-8", 8, TableZone.MAIN_HALL));

        AllocationRequestDTO req = new AllocationRequestDTO();
        req.setCustomerId(testCustomer.getId());
        req.setPartySize(3);

        // Act
        SessionResponseDTO result = allocationService.allocateAutomatically(req);

        // Assert: Best fit must be T-4
        assertNotNull(result);
        assertEquals(t4.getId(), result.getTableId());
        assertEquals("T-4", result.getTableNumber());

        RestaurantTable updatedT4 = tableRepository.findById(t4.getId()).orElseThrow();
        assertEquals(TableStatus.OCCUPIED, updatedT4.getStatus());
    }

    @Test
    @DisplayName("Concurrency Prevention: Double allocation of the same table throws conflict exception")
    void testPreventDoubleAllocation() {
        RestaurantTable table = tableRepository.save(new RestaurantTable("T-10", 4, TableZone.MAIN_HALL));

        AllocationRequestDTO req1 = new AllocationRequestDTO();
        req1.setTableId(table.getId());
        req1.setCustomerId(testCustomer.getId());
        req1.setPartySize(2);

        // First allocation succeeds
        SessionResponseDTO firstAlloc = allocationService.allocateManually(req1);
        assertNotNull(firstAlloc);

        // Second allocation must fail with TableAlreadyOccupiedException
        AllocationRequestDTO req2 = new AllocationRequestDTO();
        req2.setTableId(table.getId());
        req2.setCustomerId(testCustomer.getId());
        req2.setPartySize(3);

        assertThrows(TableAlreadyOccupiedException.class, () -> {
            allocationService.allocateManually(req2);
        });
    }
}

