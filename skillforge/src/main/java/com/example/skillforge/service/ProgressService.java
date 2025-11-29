package com.example.skillforge.service;

import com.example.skillforge.dto.response.ProgressResponse;
import com.example.skillforge.model.entity.CourseProgress;
import com.example.skillforge.repository.CourseProgressRepository;
import com.example.skillforge.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final CourseProgressRepository courseProgressRepository;
    private final CourseRepository courseRepository;

    public List<ProgressResponse> getProgressForStudent(Long studentId) {

        List<CourseProgress> courseList =
                courseProgressRepository.findByStudentId(studentId);

        List<ProgressResponse> result = new ArrayList<>();

        for (CourseProgress cp : courseList) {

            String courseName = courseRepository.findById(cp.getCourseId())
                    .map(c -> c.getTitle())
                    .orElse("Unknown Course");

            result.add(
                    ProgressResponse.builder()
                            .courseId(cp.getCourseId())
                            .courseName(courseName)
                            .completionPercentage(cp.getProgressPercent())
                            .studentId(studentId)
                            .build()
            );
        }

        return result;
    }

    public ProgressResponse getProgressForCourse(Long studentId, Long courseId) {

        CourseProgress cp =
                courseProgressRepository.findByStudentIdAndCourseId(studentId, courseId)
                        .orElse(null);

        if (cp == null) return null;

        return ProgressResponse.builder()
                .courseId(courseId)
                .studentId(studentId)
                .completionPercentage(cp.getProgressPercent())
                .build();
    }
}
