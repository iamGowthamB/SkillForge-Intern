package com.example.skillforge.controller;

import com.example.skillforge.dto.request.CourseRequest;
import com.example.skillforge.dto.response.ApiResponse;
import com.example.skillforge.dto.response.CourseResponse;
import com.example.skillforge.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CourseRequest request,
            @RequestParam Long instructorId
    ) {
        CourseResponse course = courseService.createCourse(request, instructorId);
        return ResponseEntity.ok(ApiResponse.success("Course created successfully", course));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> getCourse(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentId
    ) {
        CourseResponse course = courseService.getCourseById(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Course retrieved", course));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses(
            @RequestParam(required = false) Long studentId
    ) {
        List<CourseResponse> courses = courseService.getAllCourses(studentId);
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved", courses));
    }

    @GetMapping("/published")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getPublishedCourses(
            @RequestParam(required = false) Long studentId
    ) {
        List<CourseResponse> courses = courseService.getPublishedCourses(studentId);
        return ResponseEntity.ok(ApiResponse.success("Published courses retrieved", courses));
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getInstructorCourses(
            @PathVariable Long instructorId
    ) {
        List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
        return ResponseEntity.ok(ApiResponse.success("Instructor courses retrieved", courses));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request
    ) {
        CourseResponse course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<Void>> publishCourse(@PathVariable Long id) {
        courseService.publishCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course published successfully", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }
}