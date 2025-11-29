package com.example.skillforge.service;

import com.example.skillforge.dto.response.ProgressResponse;
import com.example.skillforge.model.entity.CourseProgress;
import com.example.skillforge.model.entity.Progress;
import com.example.skillforge.model.entity.Topic;
import com.example.skillforge.repository.CourseProgressRepository;
import com.example.skillforge.repository.ProgressRepository;
import com.example.skillforge.repository.TopicRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class AdaptiveLearningService {

    private final CourseProgressRepository courseProgressRepository;
    private final TopicRepository topicRepository;
    private final ProgressRepository progressRepository;

    public Topic recommendNextTopic(Long studentId, Long courseId) {

        // Load all topics for this course
        List<Topic> topics = topicRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        if (topics.isEmpty()) return null;

        // Load course progress
        Optional<CourseProgress> cpOpt =
                courseProgressRepository.findByStudentIdAndCourseId(studentId, courseId);

        // No progress → start with first topic
        if (cpOpt.isEmpty()) return topics.get(0);

        CourseProgress cp = cpOpt.get();

        Integer percent = Optional.ofNullable(cp.getProgressPercent()).orElse(0);
        Long lastTopicId = cp.getLastTopicId();

        // If last topic is null → start with first topic
        if (lastTopicId == null) return topics.get(0);

        // Find index
        int index = 0;
        for (int i = 0; i < topics.size(); i++) {
            if (topics.get(i).getId().equals(lastTopicId)) {
                index = i;
                break;
            }
        }

        // Adaptive Logic
        if (percent < 50) {
            return topics.get(index); // stay same topic
        }

        if (percent < 80) {
            return topics.get(Math.min(index + 1, topics.size() - 1));
        }

        return topics.get(Math.min(index + 1, topics.size() - 1));
    }

    @Transactional
    public ProgressResponse updateProgress(Progress progress) {
        Progress saved = progressRepository.save(progress);

        return ProgressResponse.builder()
                .id(saved.getId())
                .studentId(saved.getStudent().getId())
                .courseId(saved.getCourse().getId())
                .completionPercentage(saved.getCompletionPercentage())
                .currentTopicId(saved.getCurrentTopicId())
                .skillScore(saved.getSkillScore())
                .lastAccessed(saved.getLastAccessed())
                .build();
    }
}
