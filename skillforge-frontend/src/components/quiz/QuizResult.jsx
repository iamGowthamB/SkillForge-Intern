import React from "react";
import { CheckCircle, Clock } from "lucide-react"; // icons

export default function QuizResult({ result }) {
  const score = result.score?.toFixed ? result.score.toFixed(2) : result.score;
  const passed = score >= 40; // you can customize pass mark

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle
            className={`w-10 h-10 ${passed ? "text-green-600" : "text-red-600"}`}
          />
          <h2 className="text-3xl font-bold">
            Quiz Completed!
          </h2>
        </div>

        {/* SCORE CARD */}
        <div
          className={`p-6 rounded-xl text-center ${
            passed ? "bg-green-50 border border-green-300" : "bg-red-50 border border-red-300"
          }`}
        >
          <p className="text-lg font-semibold">
            Your Performance
          </p>

          <p
            className={`text-5xl font-extrabold mt-3 ${
              passed ? "text-green-700" : "text-red-700"
            }`}
          >
            {score}%
          </p>

          <p className="text-sm mt-1 text-gray-600">
            {passed ? "Excellent! You passed 🎉" : "Keep practicing! You can do it 💪"}
          </p>
        </div>

        {/* DETAILS */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5" />
            <span className="text-lg">
              Time Spent: <strong>{result.timeSpent || "-"} seconds</strong>
            </span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
          >
            Retry Quiz
          </button>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );
}
