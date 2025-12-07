import api from './api'

export const quizService = {
  async generateAIQuiz(request) {
    const response = await api.post('/quizzes/generate', request)
    return response.data.data // Extract the actual AIQuizResponse from ApiResponse wrapper
  },

  async saveAIQuiz(params, quizData) {
    const url = `/quizzes/save-from-ai?instructorId=${params.instructorId}&courseId=${params.courseId}&topicId=${params.topicId}&title=${encodeURIComponent(params.title)}`
    const response = await api.post(url, quizData)
    return response.data
  },

  async createQuiz(quizData) {
    const response = await api.post('/quizzes', quizData)
    return response.data
  },

  async getQuizByTopic(topicId) {
    const response = await api.get(`/quizzes/topic/${topicId}`)
    return response.data
  },
  
  async getAIQuizByTopic(topicId) {
    const response = await api.get(`/quizzes/topic/${topicId}/ai`)
    return response.data
  },
  
  async getMCQByTopic(topicId) {
    const response = await api.get(`/quizzes/topic/${topicId}/mcq`)
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
