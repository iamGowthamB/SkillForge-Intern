package com.example.skillforge.controller;

import com.example.skillforge.dto.response.ApiResponse;
import com.example.skillforge.model.entity.Topic;
import com.example.skillforge.service.AdaptiveLearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adaptive")
@CrossOrigin
@RequiredArgsConstructor
public class AdaptiveLearningController {

    private final AdaptiveLearningService adaptiveLearningService;

    @GetMapping("/next-topic")
    public ApiResponse getNextTopic(
            @RequestParam Long studentId,
            @RequestParam Long courseId
    ) {
        Topic t = adaptiveLearningService.recommendNextTopic(studentId, courseId);
        return ApiResponse.success("next-topic", t);
    }
}



