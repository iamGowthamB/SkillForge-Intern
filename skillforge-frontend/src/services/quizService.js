import api from './api'

export const quizService = {
  async generateAIQuiz(request) {
    const response = await api.post('/quizzes/generate', request)
    return response.data
  },

  async saveAIQuiz({ instructorId, courseId, topicId, title, aiResponse }) {
    const response = await api.post(`/quizzes/save-from-ai?instructorId=${instructorId}&courseId=${courseId}&topicId=${topicId}&title=${encodeURIComponent(title)}`, aiResponse)
    return response.data
  },

  async getQuizByTopic(topicId) {
    const response = await api.get(`/quizzes/topic/${topicId}`)
    return response.data
  },
  async getQuestionsByQuiz(quizId) {
    const response = await api.get(`/quizzes/${quizId}/questions`);
    return response.data.data;
  },

  async submitAttempt(quizId, payload) {
    const response = await api.post(`/quizzes/${quizId}/attempt`, payload)
    return response.data
  },
  async getQuizById(quizId) {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data.data;
  }

}
