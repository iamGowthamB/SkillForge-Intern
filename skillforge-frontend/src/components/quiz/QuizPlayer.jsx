// src/components/Quiz/QuizPlayer.jsx
import { useEffect, useState } from "react";
import { getQuestionsByQuiz } from "../../services/quizApi";
import { submitAttempt } from "../../services/attemptApi";
import QuizResult from "./QuizResult";

export default function QuizPlayer({ quizId, topicId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getQuestionsByQuiz(quizId);
    setQuestions(data);
  };

  const handleSubmit = async () => {
    const formatted = Object.entries(answers).map(([qid, ans]) => ({
      questionId: qid,
      answerText: ans,
    }));

    const body = {
      studentId: 1,
      topicId: topicId,
      timeSpent: 30,
      answers: formatted,
    };

    const result = await submitAttempt(quizId, body);
    setSubmitted(result);
  };

  if (submitted) {
    return <QuizResult result={submitted} />;
  }

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Quiz Started</h3>

      {questions.map((q, idx) => (
        <div key={q.id} className="mb-4">
          <p className="font-semibold">
            {idx + 1}. {q.questionText}
          </p>

          {q.answers.map((op) => (
            <label key={op.id} className="block mt-1">
              <input
                type="radio"
                name={`q${q.id}`}
                value={op.optionText}
                onChange={() =>
                  setAnswers({ ...answers, [q.id]: op.optionText })
                }
              />
              <span className="ml-2">{op.optionText}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Submit Quiz
      </button>
    </div>
  );
}
