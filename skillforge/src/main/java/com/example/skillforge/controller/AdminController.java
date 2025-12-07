package com.example.skillforge.controller;

import com.example.skillforge.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Test controller for ADMIN role endpoints
 * All endpoints require ADMIN role
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    /**
     * Get admin dashboard data
     * Requires ADMIN role
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminDashboard(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Welcome to Admin Dashboard");
        data.put("user", authentication.getName());
        data.put("role", "ADMIN");
        data.put("features", new String[]{
            "Manage All Users",
            "View System Analytics",
            "Manage Courses & Content",
            "System Configuration",
            "Access Control Management"
        });
        
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard data", data));
    }

    /**
     * Get system statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemStats(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", 500);
        data.put("totalStudents", 420);
        data.put("totalInstructors", 78);
        data.put("totalAdmins", 2);
        data.put("totalCourses", 150);
        data.put("activeEnrollments", 1250);
        
        return ResponseEntity.ok(ApiResponse.success("System statistics", data));
    }

    /**
     * Manage users (admin only)
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> manageUsers(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "User Management Panel");
        data.put("access", "Full Control");
        
        return ResponseEntity.ok(ApiResponse.success("User management data", data));
    }
}
