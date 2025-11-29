// src/services/attemptApi.js
import api from "../services/api"; // 🔥 your global axios (includes token automatically)

// Submit quiz attempt
export const submitAttempt = async (quizId, body) => {
  const res = await api.post(`/quizzes/${quizId}/attempt`, body);
  return res.data.data;
};

export default { submitAttempt };
