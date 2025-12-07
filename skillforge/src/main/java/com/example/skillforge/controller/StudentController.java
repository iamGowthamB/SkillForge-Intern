package com.example.skillforge.controller;

import com.example.skillforge.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Test controller for STUDENT role endpoints
 * All endpoints require STUDENT role
 */
@RestController
@RequestMapping("/api/student")
public class StudentController {

    /**
     * Get student dashboard data
     * Requires STUDENT role
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentDashboard(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Welcome to Student Dashboard");
        data.put("user", authentication.getName());
        data.put("role", "STUDENT");
        data.put("features", new String[]{
            "View Enrolled Courses",
            "Track Learning Progress",
            "Take Quizzes",
            "View Adaptive Learning Path"
        });
        
        return ResponseEntity.ok(ApiResponse.success("Student dashboard data", data));
    }

    /**
     * Get student profile
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Student Profile");
        data.put("user", authentication.getName());
        
        return ResponseEntity.ok(ApiResponse.success("Student profile data", data));
    }

    /**
     * Get student learning stats
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(Authentication authentication) {
        Map<String, Object> data = new HashMap<>();
        data.put("coursesEnrolled", 5);
        data.put("coursesCompleted", 2);
        data.put("quizzesTaken", 12);
        data.put("averageScore", 85.5);
        
        return ResponseEntity.ok(ApiResponse.success("Student statistics", data));
    }
}
