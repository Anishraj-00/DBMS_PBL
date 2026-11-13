package com.restaurant.tablemgmt.service;

import com.restaurant.tablemgmt.dto.CustomerDTO;
import com.restaurant.tablemgmt.entity.Customer;
import com.restaurant.tablemgmt.exception.ResourceNotFoundException;
import com.restaurant.tablemgmt.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Transactional
    public CustomerDTO createCustomer(CustomerDTO dto) {
        Customer customer = new Customer(dto.getFullName(), dto.getPhoneNumber(), dto.getNotes());
        Customer saved = customerRepository.save(customer);
        return toDTO(saved);
    }

    @Transactional
    public Customer findOrCreateCustomer(Long customerId, String name, String phone, String notes) {
        if (customerId != null) {
            return getCustomerById(customerId);
        }
        if (phone != null && !phone.isBlank()) {
            return customerRepository.findByPhoneNumber(phone)
                    .orElseGet(() -> customerRepository.save(new Customer(
                            (name != null && !name.isBlank()) ? name : "Walk-in Guest",
                            phone,
                            notes
                    )));
        }
        // Fallback for anonymous walk-in
        String walkInPhone = "WALKIN-" + System.currentTimeMillis();
        return customerRepository.save(new Customer(
                (name != null && !name.isBlank()) ? name : "Walk-in Guest",
                walkInPhone,
                notes
        ));
    }

    public CustomerDTO toDTO(Customer customer) {
        return new CustomerDTO(
                customer.getId(),
                customer.getFullName(),
                customer.getPhoneNumber(),
                customer.getNotes()
        );
    }
}

