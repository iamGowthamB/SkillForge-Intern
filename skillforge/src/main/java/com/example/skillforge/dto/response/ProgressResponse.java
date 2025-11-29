//package com.example.skillforge.dto.response;
//
//import com.example.skillforge.model.enums.DifficultyLevel;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class ProgressResponse {
//    private Long id;
//    private String courseName;
//    private Integer completionPercentage;
//    private DifficultyLevel currentLevel;
//    private Integer totalTimeSpent;
//    private Integer topicsCompleted;
//    private Integer quizzesCompleted;
//    private Double averageQuizScore;
//    private LocalDateTime lastAccessedAt;
//}

package com.example.skillforge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressResponse {
    private Long id;
    private Long studentId;
    private Long courseId;
    private Integer completionPercentage;
    private Long currentTopicId;
    private Integer skillScore;
    private LocalDateTime lastAccessed;
    private String courseName;

}
