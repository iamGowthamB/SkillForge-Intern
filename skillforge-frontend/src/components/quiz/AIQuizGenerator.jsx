// src/components/quiz/AIQuizGenerator.jsx
import { useState } from "react";
import { generateAIQuiz, saveAIQuiz } from "../../services/aiApi";

export default function AIQuizGenerator({ courseId, topicId, instructorId }) {
  const [topicName, setTopicName] = useState("");
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // -----------------------------
  // GENERATE AI QUIZ
  // -----------------------------
  const handleGenerate = async () => {
    try {
      const body = { topicName, difficulty, numberOfQuestions };
      const data = await generateAIQuiz(body);
      setGeneratedQuiz(data);
    } catch (err) {
      console.error("Generate error:", err);
      alert("Failed to generate AI quiz");
    }
  };

  // -----------------------------
  // SAVE AI QUIZ (USES REAL IDS)
  // -----------------------------
  const handleSave = async () => {
    try {
      const params = {
        instructorId,
        courseId,
        topicId,
        title: `${topicName} - AI Quiz`,
      };

      const saved = await saveAIQuiz(params, generatedQuiz);
      alert("AI Quiz saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save quiz!");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">AI Quiz Generator</h2>


      {/* Topic Name */}
      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Enter Topic Name"
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
      />

      {/* Difficulty */}
      <select
        className="w-full mb-3 p-2 border rounded"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option>BEGINNER</option>
        <option>INTERMEDIATE</option>
        <option>ADVANCED</option>
      </select>

      {/* Number of Questions */}
      <input
        type="number"
        className="w-full mb-3 p-2 border rounded"
        value={numberOfQuestions}
        onChange={(e) => setNumberOfQuestions(e.target.value)}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Quiz
      </button>

      {/* Save Button */}
      {generatedQuiz && (
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Quiz to Database
          </button>
        </div>
      )}
    </div>
  );
}
