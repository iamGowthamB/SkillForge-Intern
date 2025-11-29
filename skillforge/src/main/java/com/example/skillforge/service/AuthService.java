package com.example.skillforge.service;

import com.example.skillforge.dto.request.LoginRequest;
import com.example.skillforge.dto.request.RegisterRequest;
import com.example.skillforge.dto.response.AuthResponse;
import com.example.skillforge.model.entity.Instructor;
import com.example.skillforge.model.entity.Student;
import com.example.skillforge.model.entity.User;
import com.example.skillforge.model.enums.Role;
import com.example.skillforge.repository.StudentRepository;
import com.example.skillforge.repository.UserRepository;
import com.example.skillforge.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final StudentRepository studentRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        user.setIsActive(true);

        // Create role-specific profile with proper mapping
        if (request.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user); // Set bidirectional relationship
            user.setStudent(student);
        } else if (request.getRole() == Role.INSTRUCTOR) {
            Instructor instructor = new Instructor();
            instructor.setUser(user); // Set bidirectional relationship
            instructor.setSpecialization(request.getSpecialization());
            user.setInstructor(instructor);
        }

        // Save user (cascade will save Student/Instructor)
        user = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        Student student = studentRepository.findByUserId(user.getId()).orElse(null);
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .studentId(student != null ? student.getId() : null)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
