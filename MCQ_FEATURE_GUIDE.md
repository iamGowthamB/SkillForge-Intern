# MCQ (Multiple Choice Questions) Feature - Implementation Guide

## Overview

Instructors can now create MCQ (Multiple Choice Questions) directly in the "Add Material" section alongside videos, PDFs, and external links.

## How to Use - For Instructors

### Step 1: Navigate to Course Materials

1. Login to SkillForge as an Instructor
2. Open an existing course or create a new course
3. Click on a Topic to expand it
4. Click **"Add Material"** button

### Step 2: Select MCQ Type

1. In the "Material Type" dropdown, select **"MCQ (Multiple Choice Questions)"**
2. The form will switch to MCQ creation mode

### Step 3: Fill MCQ Details

- **MCQ Title**: Enter the name of the quiz (e.g., "Chapter 1 Assessment")
- **Description** (Optional): Add context or instructions
- **Difficulty Level**: Select from:
  - Beginner
  - Intermediate
  - Advanced
- **Duration** (minutes): Set time limit (1-180 minutes)

### Step 4: Create Questions

1. Click **"+ Add Question"** to add the first question
2. For each question:
   - **Question Text**: Type the question
   - **Options A-D**: Enter 4 options
   - **Correct Answer**: Select the radio button next to the correct option
3. Click **"+ Add Question"** to add more questions
4. Use **"Remove"** to delete questions if needed

### Step 5: Save MCQ

Click **"Create MCQ"** button to save the MCQ

## MCQ Features

### Question Management

- ✅ Add unlimited questions
- ✅ Remove unwanted questions
- ✅ Set one correct answer per question
- ✅ Reorder questions (visual order)

### Question Types

- Single selection (A, B, C, or D)
- Multiple difficulty levels
- Time-based quizzes
- Question descriptions

### Student Features

- Take quiz within time limit
- See immediate feedback
- Track quiz performance
- Retake MCQs multiple times
- View results and correct answers

## Technical Implementation

### Backend Integration

- **Endpoint**: POST `/api/quizzes/create`
- **Service**: `QuizService` with MCQ support
- **Storage**: MCQs stored as Quiz entities with embedded questions

### Frontend Components

- **Location**: `src/components/course/CourseDetail.jsx`
- **State Management**: React hooks with form validation
- **Material Types**: VIDEO, PDF, LINK, **MCQ**

### Database Structure

MCQs are created as Quiz records with:

```
Quiz
├── title: String
├── description: String
├── difficulty: BEGINNER|INTERMEDIATE|ADVANCED
├── duration: Integer (minutes)
├── topicId: Foreign Key
└── Question[]
    ├── questionText: String
    ├── options: String[] (4 options)
    ├── correctAnswer: String (A, B, C, D)
    └── orderIndex: Integer
```

## Validation Rules

### Required Fields

- ✓ MCQ Title
- ✓ At least 1 question
- ✓ All question text filled
- ✓ All 4 options filled per question
- ✓ Correct answer selected for each question

### File Size Limits

- N/A (MCQs are text-based, no file upload)

### Character Limits

- Title: Recommended max 100 characters
- Question Text: Recommended max 500 characters
- Options: Recommended max 200 characters each

## Example MCQ

**Title**: "JavaScript Basics Quiz"
**Difficulty**: Beginner
**Duration**: 15 minutes

**Question 1**: What does MCQ stand for?

- A) Multiple Choice Query
- B) Multiple Choice Question ✓ (Correct)
- C) Multi Component Query
- D) Modern Code Quality

**Question 2**: Which operator is used for assignment?

- A) ==
- B) ===
- C) = ✓ (Correct)
- D) =>

## API Integration

### Create MCQ

```bash
POST /api/quizzes/create
Content-Type: application/json

{
  "topicId": 1,
  "title": "Chapter 1 Quiz",
  "description": "Assessment for chapter 1",
  "difficulty": "BEGINNER",
  "duration": 15,
  "questions": [
    {
      "questionText": "Sample question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A",
      "orderIndex": 0
    }
  ]
}
```

### Get MCQs by Topic

```bash
GET /api/quizzes/topic/{topicId}
```

### Take MCQ

```bash
POST /api/quiz-attempts
Content-Type: application/json

{
  "quizId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedOption": "A"
    }
  ]
}
```

## Testing Checklist

### As Instructor

- [ ] Can see "MCQ (Multiple Choice Questions)" option in material type dropdown
- [ ] Can add MCQ title and description
- [ ] Can add multiple questions
- [ ] Can enter 4 options for each question
- [ ] Can select correct answer for each question
- [ ] Can add/remove questions
- [ ] Can set difficulty and duration
- [ ] MCQ saves successfully
- [ ] MCQ appears in topic's materials list

### As Student

- [ ] Can see MCQs listed under topic
- [ ] Can open MCQ and see all questions
- [ ] Can select answers (radio buttons)
- [ ] Can submit MCQ within time limit
- [ ] Can see score after submission
- [ ] Can see which answers were correct
- [ ] Can see correct answers for missed questions
- [ ] Can retake MCQ

## Login Credentials for Testing

**Instructor Account**:

- Email: (Create as INSTRUCTOR during registration)
- Role: INSTRUCTOR

**Student Account**:

- Email: test@test.com
- Password: test123
- Role: STUDENT

## Troubleshooting

### MCQ not saving?

- Verify all questions have question text
- Verify all options (A, B, C, D) are filled
- Verify correct answer is selected
- Check browser console for errors

### Questions not displaying?

- Refresh the page
- Check if MCQ was created (check in API response)
- Verify questions array is populated

### Options not showing?

- Ensure you entered text in all 4 option fields
- Check character encoding in special characters

## Future Enhancements

- [ ] Question image/media support
- [ ] Question shuffling for security
- [ ] Answer shuffling for different attempts
- [ ] Question pools with random selection
- [ ] Negative marking
- [ ] Partial credit scoring
- [ ] Question hints/explanations
- [ ] Time per question
- [ ] Question review before submission

---

**Status**: ✅ MCQ feature is live and ready to use!
