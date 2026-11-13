package com.restaurant.tablemgmt.controller;

import com.restaurant.tablemgmt.dto.StatusUpdateDTO;
import com.restaurant.tablemgmt.dto.TableRequestDTO;
import com.restaurant.tablemgmt.dto.TableResponseDTO;
import com.restaurant.tablemgmt.entity.enums.TableStatus;
import com.restaurant.tablemgmt.entity.enums.TableZone;
import com.restaurant.tablemgmt.service.TableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    @GetMapping
    public ResponseEntity<List<TableResponseDTO>> getAllTables(
            @RequestParam(required = false) TableStatus status,
            @RequestParam(required = false) TableZone zone) {
        return ResponseEntity.ok(tableService.getAllTables(status, zone));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableResponseDTO> getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }

    @PostMapping
    public ResponseEntity<TableResponseDTO> createTable(@Valid @RequestBody TableRequestDTO dto) {
        return new ResponseEntity<>(tableService.createTable(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableResponseDTO> updateTable(@PathVariable Long id, @Valid @RequestBody TableRequestDTO dto) {
        return ResponseEntity.ok(tableService.updateTable(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TableResponseDTO> updateTableStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO dto) {
        return ResponseEntity.ok(tableService.updateTableStatus(id, dto.getStatus(), dto.getReason()));
    }
}

