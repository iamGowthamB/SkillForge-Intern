package com.example.skillforge.service;


import com.example.skillforge.model.entity.Course;
import com.example.skillforge.model.entity.Enrollment;
import com.example.skillforge.model.entity.Student;
import com.example.skillforge.repository.CourseRepository;
import com.example.skillforge.repository.EnrollmentRepository;
import com.example.skillforge.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    /**
     * Enroll a student in a course
     */
    @Transactional
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        // Check if already enrolled
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        // Get student entity
        Student student = studentRepository.findByUserId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Get course entity
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Create enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setCompletionPercentage(0);
        enrollment.setIsCompleted(false);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setLastAccessedAt(LocalDateTime.now());

        enrollment = enrollmentRepository.save(enrollment);

        // Update course enrollment count
        course.setTotalEnrollments(course.getTotalEnrollments() + 1);
        courseRepository.save(course);

        // Update student stats
        student.setCoursesEnrolled(student.getCoursesEnrolled() + 1);
        studentRepository.save(student);

        return enrollment;
    }

    /**
     * Get all enrollments for a student
     */
    public List<Enrollment> getStudentEnrollments(Long studentId) {
        Student student = studentRepository.findByUserId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return enrollmentRepository.findByStudentId(student.getId());
    }

    /**
     * Get enrollment by student and course
     */
    public Enrollment getEnrollment(Long studentId, Long courseId) {
        Student student = studentRepository.findByUserId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
    }

    /**
     * Update enrollment progress
     */
    @Transactional
    public Enrollment updateProgress(Long studentId, Long courseId, Integer completionPercentage) {
        Enrollment enrollment = getEnrollment(studentId, courseId);

        enrollment.setCompletionPercentage(completionPercentage);
        enrollment.setLastAccessedAt(LocalDateTime.now());

        // Mark as completed if 100%
        if (completionPercentage >= 100) {
            enrollment.setIsCompleted(true);
            enrollment.setCompletedAt(LocalDateTime.now());
        }

        return enrollmentRepository.save(enrollment);
    }

    /**
     * Unenroll a student from a course
     */
    @Transactional
    public void unenrollStudent(Long studentId, Long courseId) {
        Student student = studentRepository.findByUserId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Delete enrollment
        enrollmentRepository.delete(enrollment);

        // Update course enrollment count
        course.setTotalEnrollments(Math.max(0, course.getTotalEnrollments() - 1));
        courseRepository.save(course);

        // Update student stats
        student.setCoursesEnrolled(Math.max(0, student.getCoursesEnrolled() - 1));
        studentRepository.save(student);
    }

    /**
     * Check if student is enrolled in course
     */
    public boolean isEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Get enrollments for a course
     */
    public List<Enrollment> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
}
