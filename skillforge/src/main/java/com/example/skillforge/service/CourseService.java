package com.example.skillforge.service;

import com.example.skillforge.dto.request.CourseRequest;
import com.example.skillforge.dto.response.CourseResponse;
import com.example.skillforge.model.entity.Course;
import com.example.skillforge.model.entity.CourseProgress;
import com.example.skillforge.model.entity.Instructor;
import com.example.skillforge.model.entity.User;
import com.example.skillforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseProgressRepository courseProgressRepository;


    @Transactional
    public CourseResponse createCourse(CourseRequest request, Long userId) {
        // Find instructor by user ID
        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setInstructor(instructor); // Set mapped relationship
        course.setDifficultyLevel(request.getDifficultyLevel());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setDuration(request.getDuration() != null ? request.getDuration() : 0);
        course.setIsPublished(false);

        course = courseRepository.save(course);

        // Update instructor stats
        instructor.setCoursesCreated(instructor.getCoursesCreated() + 1);
        instructorRepository.save(instructor);

        return mapToCourseResponse(course, null);
    }

    public CourseResponse getCourseById(Long id, Long userId) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToCourseResponse(course, userId);
    }

    public List<CourseResponse> getAllCourses(Long userId) {
        return courseRepository.findAll().stream()
                .map(course -> mapToCourseResponse(course, userId))
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getCoursesByInstructor(Long userId) {
        Instructor instructor = instructorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        return instructor.getCourses().stream()
                .map(course -> mapToCourseResponse(course, null))
                .collect(Collectors.toList());
    }

    public List<CourseResponse> getPublishedCourses(Long userId) {
        return courseRepository.findByIsPublished(true).stream()
                .map(course -> mapToCourseResponse(course, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setDifficultyLevel(request.getDifficultyLevel());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setDuration(request.getDuration() != null ? request.getDuration() : course.getDuration());

        course = courseRepository.save(course);
        return mapToCourseResponse(course, null);
    }

    @Transactional
    public void publishCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setIsPublished(true);
        courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Update instructor stats
        Instructor instructor = course.getInstructor();
        instructor.setCoursesCreated(Math.max(0, instructor.getCoursesCreated() - 1));
        instructorRepository.save(instructor);

        courseRepository.delete(course);
    }

    private CourseResponse mapToCourseResponse(Course course, Long userId) {

        User instructorUser = course.getInstructor().getUser();

        // check enrollment
        Boolean isEnrolled = false;
        if (userId != null) {
            isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(userId, course.getId());
        }

        // get course progress for this student
        Integer progressPercent = null;
        if (userId != null) {
            progressPercent = courseProgressRepository
                    .findByStudentIdAndCourseId(userId, course.getId())
                    .map(CourseProgress::getProgressPercent)
                    .orElse(0);
        }

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .instructorId(instructorUser.getId())
                .instructorName(instructorUser.getName())
                .difficultyLevel(course.getDifficultyLevel())
                .thumbnailUrl(course.getThumbnailUrl())
                .duration(course.getDuration())
                .totalTopics(course.getTopics().size())
                .totalEnrollments(course.getTotalEnrollments())
                .isPublished(course.getIsPublished())
                .isEnrolled(isEnrolled)
                .createdAt(course.getCreatedAt())

                // ⭐⭐ FIXED — Send progress to frontend ⭐⭐
                .progressPercent(progressPercent)

                .build();
    }

}
