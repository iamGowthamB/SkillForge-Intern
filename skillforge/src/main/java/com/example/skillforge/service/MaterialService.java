package com.example.skillforge.service;

import com.example.skillforge.exception.ResourceNotFoundException;
import com.example.skillforge.model.entity.Material;
import com.example.skillforge.model.entity.Topic;
import com.example.skillforge.model.enums.MaterialType;
import com.example.skillforge.repository.MaterialRepository;
import com.example.skillforge.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final TopicRepository topicRepository;
    private final LocalStorageService localStorageService;

    @Transactional
    public Material uploadFileMaterial(
            Long topicId,
            String title,
            String description,
            MaterialType materialType,
            MultipartFile file
    ) throws IOException {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        // Upload to local storage
        String fileUrl = localStorageService.uploadFile(file, "materials");

        Material material = new Material();
        material.setTopic(topic);
        material.setTitle(title);
        material.setDescription(description);
        material.setMaterialType(materialType);
        material.setFileName(file.getOriginalFilename());
        material.setFilePath(fileUrl);
        material.setFileSize(file.getSize());
        material.setMimeType(file.getContentType());

        materialRepository.save(material);

        topic.setMaterialsCount(topic.getMaterials().size());
        topicRepository.save(topic);

        return material;
    }

    @Transactional
    public Material createLinkMaterial(Long topicId, String title, String description, String externalUrl) {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        Material material = new Material();
        material.setTopic(topic);
        material.setTitle(title);
        material.setDescription(description);
        material.setMaterialType(MaterialType.LINK);
        material.setExternalUrl(externalUrl);

        materialRepository.save(material);

        topic.setMaterialsCount(topic.getMaterials().size());
        topicRepository.save(topic);

        return material;
    }

    public List<Material> getMaterialsByTopic(Long topicId) {

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found"));

        return topic.getMaterials();
    }

    @Transactional
    public void deleteMaterial(Long materialId) {

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        if (material.getFilePath() != null)
            localStorageService.deleteFile(material.getFilePath());

        Topic topic = material.getTopic();
        topic.getMaterials().remove(material);
        materialRepository.delete(material);

        topic.setMaterialsCount(topic.getMaterials().size());
        topicRepository.save(topic);
    }
}

