package com.example.skillforge.service.impl;

import com.example.skillforge.model.entity.Course;
import com.example.skillforge.model.entity.CourseProgress;
import com.example.skillforge.repository.CourseProgressRepository;
import com.example.skillforge.repository.TopicProgressRepository;
import com.example.skillforge.repository.TopicRepository;
import com.example.skillforge.service.CourseProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CourseProgressServiceImpl implements CourseProgressService {

    private final CourseProgressRepository courseProgressRepository;
    private final TopicProgressRepository topicProgressRepository;
    private final TopicRepository topicRepository;

    @Override
    public void updateProgress(Long studentId, Long courseId) {

        // total topics in the course
        long totalTopics = topicRepository.countByCourseId(courseId);

        if (totalTopics == 0) return;

        // completed topics count
        long completedTopics = topicProgressRepository.countCompletedTopics(studentId, courseId);

        int percent = (int) ((completedTopics * 100.0) / totalTopics);

        // find or create course progress row
        CourseProgress cp = courseProgressRepository
                .findByStudentIdAndCourseId(studentId, courseId)
                .orElseGet(() -> {
                    CourseProgress c = new CourseProgress();
                    c.setStudentId(studentId);
                    c.setCourseId(courseId);
                    c.setProgressPercent(percent);
                    return c;
                });

        cp.setProgressPercent(percent);
        cp.setLastUpdated(LocalDateTime.now());

        courseProgressRepository.save(cp);
    }
}
