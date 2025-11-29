//package com.example.skillforge.repository;
//
//import com.example.skillforge.model.entity.*;
//import com.example.skillforge.model.enums.Role;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//import java.util.Optional;
//
//
//@Repository
//public interface CourseRepository extends JpaRepository<Course, Long> {
//    List<Course> findByInstructorId(Long instructorId);
//    List<Course> findByIsPublished(Boolean isPublished);
//
//    @Query("SELECT c FROM Course c WHERE c.isPublished = true")
//    List<Course> findAllPublishedCourses();
//
////    @Query("SELECT c FROM Course c WHERE c.instructorId = :instructorId AND c.isPublished = :published")
////    List<Course> findByInstructorAndPublished(@Param("instructorId") Long instructorId,
////                                              @Param("published") Boolean published);
//
//    @Query("SELECT c FROM Course c WHERE c.instructor.id = :instructorId AND c.isPublished = :published")
//    List<Course> findByInstructorAndPublished(@Param("instructorId") Long instructorId,
//                                              @Param("published") Boolean published);
//    List<Course> findByEnrollmentsStudentId(Long studentId);
//
//
//    Optional<CourseProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);
//}

package com.example.skillforge.repository;

import com.example.skillforge.model.entity.Course;
import com.example.skillforge.model.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Instructor courses
    List<Course> findByInstructorId(Long instructorId);

    // Published / unpublished
    List<Course> findByIsPublished(Boolean isPublished);

    @Query("SELECT c FROM Course c WHERE c.isPublished = true")
    List<Course> findAllPublishedCourses();

    // Instructor + published filter
    @Query("SELECT c FROM Course c WHERE c.instructor.id = :instructorId AND c.isPublished = :published")
    List<Course> findByInstructorAndPublished(@Param("instructorId") Long instructorId,
                                              @Param("published") Boolean published);

    // STUDENT ENROLLED COURSES (Correct!)
    List<Course> findByEnrollmentsStudentId(Long studentId);


}
