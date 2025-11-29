package com.example.skillforge.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false)
    private Long studentId;

    private Double score;
    private Integer timeSpent;
    private String status;
    private LocalDateTime attemptTime;

//    // 🔥 ADD THIS FIELD (important!)
//    @Column(name = "correct_answers")
//    private Integer correctAnswers;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;

}
