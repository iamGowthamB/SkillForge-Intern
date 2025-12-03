package com.example.skillforge.service;

import com.example.skillforge.dto.request.CourseRequest;
import com.example.skillforge.dto.response.CourseResponse;
import com.example.skillforge.model.entity.*;
import com.example.skillforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
    private final StudentRepository studentRepository;

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

//    private CourseResponse mapToCourseResponse(Course course, Long userId) {
//
//        User instructorUser = course.getInstructor().getUser();
//        // check enrollment
//        Boolean isEnrolled = false;
//        // get course progress for this student
//        Integer progressPercent = 0;
//
//
//        if (userId != null) {
//
//            Student student = studentRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Student Not Found"));
//            Long studentID = student.getId();
//
//            isEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(studentID, course.getId());
//
//            progressPercent = courseProgressRepository
//                    .findByStudentIdAndCourseId(studentID, course.getId())
//                    .map(CourseProgress::getProgressPercent)
//                    .orElse(0);
//
//            System.out.println("🔥🔥🔥From MapToCourse To check Progresss🔥🔥🔥");
//            System.out.println(progressPercent);
//
//        }
//
//
//        return CourseResponse.builder()
//                .id(course.getId())
//                .title(course.getTitle())
//                .description(course.getDescription())
//                .instructorId(instructorUser.getId())
//                .instructorName(instructorUser.getName())
//                .difficultyLevel(course.getDifficultyLevel())
//                .thumbnailUrl(course.getThumbnailUrl())
//                .duration(course.getDuration())
//                .totalTopics(course.getTopics().size())
//                .totalEnrollments(course.getTotalEnrollments())
//                .isPublished(course.getIsPublished())
//                .isEnrolled(isEnrolled)
//                .createdAt(course.getCreatedAt())
//
//                // ⭐⭐ FIXED — Send progress to frontend ⭐⭐
//                .progressPercent(progressPercent)
//
//                .build();
////    }
//private CourseResponse mapToCourseResponse(Course course, Long userId) {
//
//    User instructorUser = course.getInstructor().getUser();
//
//    // defaults
//    Boolean isEnrolled = false;
//    Integer progressPercent = 0;
//    LocalDateTime lastAccessed = null;
//
//    if (userId != null) {
//        // find Student by userId (this returns the Student entity that has its own internal PK)
//        Student student = studentRepository.findByUserId(userId)
//                .orElseThrow(() -> new RuntimeException("Student Not Found"));
//        Long studentInternalId = student.getId();
//
//        // 1) Check enrollment using internal Student id (this is correct for EnrollmentRepository)
//        Enrollment enrollment = enrollmentRepository
//                .findByStudentIdAndCourseId(studentInternalId, course.getId())
//                .orElse(null);
//
//        isEnrolled = (enrollment != null);
//
//        // 2) Try to find CourseProgress. NOTE: some code paths may have saved CourseProgress.studentId
//        //    as the frontend's userId, while others may have used the internal student id.
//        //    Try userId first (safe), then studentInternalId.
//        CourseProgress cp = null;
//        if (userId != null) {
//            cp = courseProgressRepository.findByStudentIdAndCourseId(userId, course.getId()).orElse(null);
//        }
//        if (cp == null && studentInternalId != null) {
//            cp = courseProgressRepository.findByStudentIdAndCourseId(studentInternalId, course.getId()).orElse(null);
//        }
//
//        // 3) Resolve progress + lastAccessed with fallbacks:
//        if (cp != null) {
//            progressPercent = cp.getProgressPercent() != null ? cp.getProgressPercent() : 0;
//            lastAccessed = cp.getLastUpdated();
//        } else if (enrollment != null) {
//            // fallback to Enrollment values
//            progressPercent = enrollment.getCompletionPercentage() != null ? enrollment.getCompletionPercentage() : 0;
//            lastAccessed = enrollment.getLastAccessedAt();
//        }
//
//        System.out.println("🔥 Progress for course " + course.getId() + " (userId=" + userId +
//                ", studentInternalId=" + studentInternalId + "): " + progressPercent + " lastAccessed=" + lastAccessed);
//    }
//
//    return CourseResponse.builder()
//            .id(course.getId())
//            .title(course.getTitle())
//            .description(course.getDescription())
//            .instructorId(instructorUser.getId())
//            .instructorName(instructorUser.getName())
//            .difficultyLevel(course.getDifficultyLevel())
//            .thumbnailUrl(course.getThumbnailUrl())
//            .duration(course.getDuration())
//            .totalTopics(course.getTopics().size())
//            .totalEnrollments(course.getTotalEnrollments())
//            .isPublished(course.getIsPublished())
//            .isEnrolled(isEnrolled)
//            .createdAt(course.getCreatedAt())
//            .progressPercent(progressPercent)
//            .lastAccessed(lastAccessed)
//            .build();
//}
private CourseResponse mapToCourseResponse(Course course, Long userId) {

    User instructorUser = course.getInstructor().getUser();

    // defaults
    Boolean isEnrolled = false;
    Integer progressPercent = 0;
    LocalDateTime lastAccessed = null;

    if (userId != null) {

        // 1️⃣ Fetch Student using userId → get internal student.id
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student Not Found"));
        Long studentInternalId = student.getId();

        // 2️⃣ Check enrollment correctly using internal student.id
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(studentInternalId, course.getId())
                .orElse(null);

        isEnrolled = (enrollment != null);

        // 3️⃣ Find CourseProgress with dual fallback (userId → studentId)
        CourseProgress cp = courseProgressRepository
                .findByStudentIdAndCourseId(userId, course.getId())
                .orElse(null);

        if (cp == null) {
            cp = courseProgressRepository
                    .findByStudentIdAndCourseId(studentInternalId, course.getId())
                    .orElse(null);
        }

        // 4️⃣ Extract progress + lastAccessed
        if (cp != null) {
            progressPercent = cp.getProgressPercent() != null ? cp.getProgressPercent() : 0;
            lastAccessed = cp.getLastUpdated();
        } else if (enrollment != null) {
            // fallback (if old data in enrollment table)
            progressPercent = enrollment.getCompletionPercentage() != null
                    ? enrollment.getCompletionPercentage()
                    : 0;

            lastAccessed = enrollment.getLastAccessedAt();
        }

        System.out.println("🔥 Progress for course " + course.getId() +
                " | userId=" + userId +
                " | studentInternalId=" + studentInternalId +
                " | progress=" + progressPercent +
                " | lastAccessed=" + lastAccessed);
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
            .progressPercent(progressPercent)
            .lastAccessed(lastAccessed)
            .build();
}


}
