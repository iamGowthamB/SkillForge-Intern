import api from './api'

export const dashboardService = {
  async getStudentStats(studentId) {
    const response = await api.get(`/students/${studentId}/stats`)
    return response.data
  },

  async getInstructorStats(instructorId) {
    const response = await api.get(`/instructors/${instructorId}/stats`)
    return response.data
  },

  async getAdminStats() {
    const response = await api.get('/admin/stats')
    return response.data
  }
}