package com.restaurant.tablemgmt.config;

import com.restaurant.tablemgmt.entity.Customer;
import com.restaurant.tablemgmt.entity.RestaurantTable;
import com.restaurant.tablemgmt.entity.User;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.entity.enums.TableZone;
import com.restaurant.tablemgmt.entity.enums.UserRole;
import com.restaurant.tablemgmt.repository.CustomerRepository;
import com.restaurant.tablemgmt.repository.RestaurantTableRepository;
import com.restaurant.tablemgmt.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final RestaurantTableRepository tableRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public DataLoader(RestaurantTableRepository tableRepository,
                      CustomerRepository customerRepository,
                      UserRepository userRepository) {
        this.tableRepository = tableRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    new User("admin", "admin123", "Restaurant Manager", UserRole.ADMIN),
                    new User("waiter1", "waiter123", "John Waiter", UserRole.WAITER),
                    new User("waiter2", "waiter123", "Sarah Server", UserRole.WAITER)
            ));
        }

        if (tableRepository.count() == 0) {
            tableRepository.saveAll(List.of(
                    new RestaurantTable("T-01", 2, TableZone.MAIN_HALL),
                    new RestaurantTable("T-02", 2, TableZone.MAIN_HALL),
                    new RestaurantTable("T-03", 4, TableZone.MAIN_HALL),
                    new RestaurantTable("T-04", 4, TableZone.MAIN_HALL),
                    new RestaurantTable("T-05", 6, TableZone.MAIN_HALL),
                    new RestaurantTable("T-06", 8, TableZone.MAIN_HALL),
                    new RestaurantTable("P-01", 2, TableZone.PATIO),
                    new RestaurantTable("P-02", 4, TableZone.PATIO),
                    new RestaurantTable("B-01", 2, TableZone.BALCONY),
                    new RestaurantTable("B-02", 4, TableZone.BALCONY),
                    new RestaurantTable("VIP-01", 6, TableZone.VIP),
                    new RestaurantTable("VIP-02", 10, TableZone.VIP)
            ));
        }

        if (customerRepository.count() == 0) {
            customerRepository.saveAll(List.of(
                    new Customer("Rahul Sharma", "+91 9876543210", "Prefers quiet corner tables"),
                    new Customer("Priya Patel", "+91 9812345678", "Regular customer"),
                    new Customer("Amit Verma", "+91 9988776655", "Business diner"),
                    new Customer("Sneha Reddy", "+91 9765432109", "Family with kids")
            ));
        }
    }
}

