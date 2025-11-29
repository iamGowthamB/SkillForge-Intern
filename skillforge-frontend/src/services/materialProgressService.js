import api from './api'

export const materialProgressService = {
  async markMaterialCompleted(studentId, materialId) {
    const response = await api.post('/progress/material/complete', { studentId, materialId })
    return response.data
  },

  async getTopicProgress(studentId, topicId) {
    const response = await api.get(`/progress/student/${studentId}/topic/${topicId}`)
    return response.data
  }
}
