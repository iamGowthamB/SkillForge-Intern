package com.example.skillforge.repository;

import com.example.skillforge.model.entity.TopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface TopicProgressRepository extends JpaRepository<TopicProgress, Long> {
    Optional<TopicProgress> findByStudentIdAndTopicId(Long studentId, Long topicId);
    List<TopicProgress> findByStudentIdAndTopicIdIn(Long studentId, List<Long> topicIds);
    boolean existsByStudentIdAndTopicId(Long studentId, Long topicId);
    @Query("""
    SELECT COUNT(tp) FROM TopicProgress tp
    JOIN Topic t ON tp.topicId = t.id
    WHERE tp.studentId = :studentId
    AND t.course.id = :courseId
    AND tp.completed = true
""")
    long countCompletedTopics(Long studentId, Long courseId);

}

