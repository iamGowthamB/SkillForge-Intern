# SkillForge - MCQ Feature Quick Reference

## What's New?

✨ **Multiple Choice Questions (MCQ)** can now be created alongside videos, PDFs, and links in the course material section!

## Quick Start

### For Instructors

1. **Login** as Instructor
2. **Create/Edit Course** → Select a Topic
3. **Click "Add Material"** button
4. **Select "MCQ (Multiple Choice Questions)"** from Material Type dropdown
5. **Fill Details**:
   - Title: "Chapter 1 Assessment"
   - Difficulty: Beginner/Intermediate/Advanced
   - Duration: 10-30 minutes (recommended)
6. **Add Questions**:
   - Click "+ Add Question"
   - Type question text
   - Fill options A, B, C, D
   - Select correct answer (radio button)
   - Repeat for each question
7. **Click "Create MCQ"** to save

### For Students

1. **Login** as Student
2. **Enroll** in a course
3. **Browse Topics** → Find MCQs
4. **Take Quiz**:
   - Read questions
   - Select answers
   - Submit before time runs out
5. **View Results**:
   - See score
   - Review correct answers
   - Option to retake

## Material Types Available

| Type          | Upload | Create | Edit       |
| ------------- | ------ | ------ | ---------- |
| Video         | ✅     | -      | Coming     |
| PDF Document  | ✅     | -      | Coming     |
| External Link | ✅     | -      | Coming     |
| **MCQ**       | -      | **✅** | **Coming** |

## MCQ Form Fields

### Header Information

- **MCQ Title** (required): Name of the quiz
- **Description** (optional): Instructions or context

### Settings

- **Difficulty Level**: BEGINNER / INTERMEDIATE / ADVANCED
- **Duration**: 1-180 minutes

### Questions (Dynamic)

- **Question Text**: The actual question
- **4 Options**: A, B, C, D
- **Correct Answer**: Radio selection (A, B, C, or D)
- **Add/Remove**: Buttons to manage questions

## Features

### ✅ Instructor Features

- Create MCQs with 4 options
- Set difficulty level
- Set time duration
- Add/remove questions dynamically
- Preview before saving
- View student attempts and scores
- Disable/Enable MCQs

### ✅ Student Features

- Take MCQs with timer
- Select answers easily
- Instant feedback after submission
- View scores and percentages
- See correct answers
- Retake MCQs (if allowed)
- Track progress

### ✅ Performance Features

- Automatic scoring (A=correct, others=incorrect)
- Time tracking
- Attempt history
- Analytics dashboard

## Validation

### Required Before Saving

- ✓ MCQ Title is filled
- ✓ At least 1 question added
- ✓ Each question has text
- ✓ Each question has 4 options filled
- ✓ Each question has correct answer selected

### Automatic Validation

- ✓ Title length check
- ✓ Option text validation
- ✓ Correct answer verification
- ✓ Question count validation

## Browser Compatibility

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Data Stored

When you create an MCQ, the system stores:

- Question text
- 4 answer options
- Correct answer (A, B, C, D)
- Question order
- Quiz metadata (title, difficulty, duration)
- Linked to specific topic and course

## Tips & Best Practices

### Question Writing

- ✓ Keep questions clear and concise
- ✓ Avoid double negatives
- ✓ Make all options plausible
- ✓ Correct answer randomly placed
- ✓ Options same length when possible

### Option Writing

- ✓ Use consistent grammar
- ✓ Avoid "none of the above"
- ✓ Make distractors realistic
- ✓ Avoid giving away answers

### Time Setting

- ⏱️ 1 minute per question (rough guide)
- ⏱️ 2 minutes for complex questions
- ⏱️ 30 seconds for simple recall
- ⏱️ 5 minute minimum recommended

### Difficulty Levels

- 🟢 **BEGINNER**: Basic concepts, 3-5 questions
- 🟡 **INTERMEDIATE**: Applied knowledge, 5-10 questions
- 🔴 **ADVANCED**: Analysis/synthesis, 10-15 questions

## Keyboard Shortcuts (in quiz)

- `A` / `B` / `C` / `D`: Select option
- `Tab`: Move to next question
- `Shift+Tab`: Move to previous question
- `Enter`: Submit answer
- `Esc`: Exit/Cancel quiz

## Student Experience Flow

```
Login
  ↓
Browse Course
  ↓
View Topic Materials
  ↓
See MCQ in materials list
  ↓
Click "Take Quiz"
  ↓
Read Question 1
  ↓
Select Option (A/B/C/D)
  ↓
Next Question
  ↓
[Repeat for all questions]
  ↓
Submit Quiz
  ↓
View Results
  ↓
Review Correct Answers
```

## API Endpoints

| Method | Endpoint                  | Purpose             |
| ------ | ------------------------- | ------------------- |
| POST   | `/api/quizzes/create`     | Create new MCQ      |
| GET    | `/api/quizzes/topic/{id}` | Get MCQs in topic   |
| POST   | `/api/quiz-attempts`      | Submit MCQ attempt  |
| GET    | `/api/quiz-attempts/{id}` | Get attempt details |
| DELETE | `/api/quizzes/{id}`       | Delete MCQ          |

## Testing Accounts

**Instructor**:

```
Email: instructor@test.com
Password: test123
Role: INSTRUCTOR
```

**Student**:

```
Email: test@test.com
Password: test123
Role: STUDENT
```

## FAQ

**Q: Can I edit questions after creating MCQ?**
A: Feature coming soon - for now, delete and recreate.

**Q: Can students retake MCQs?**
A: Yes! Multiple attempts allowed. Last attempt counts (configurable).

**Q: How is MCQ scored?**
A: 1 point per correct answer. Total score = correct answers / total questions × 100%.

**Q: Can I shuffle questions/options?**
A: Coming in next update.

**Q: What file types for MCQs?**
A: MCQs are text-based. No files needed!

**Q: Can I add images to questions?**
A: Coming soon - text-based for now.

**Q: Time limit enforced?**
A: Yes, quiz auto-submits when time is up.

## Support

If you encounter issues:

1. Check browser console (F12 → Console)
2. Verify all fields are filled
3. Try refreshing the page
4. Check internet connection
5. Clear browser cache (Ctrl+Shift+Delete)

---

**Now you're ready to create engaging MCQs! 🎓**
