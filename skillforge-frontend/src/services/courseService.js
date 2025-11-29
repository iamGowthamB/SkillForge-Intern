import api from './api'

export const courseService = {
  async getAllCourses(studentId = null) {
    const params = studentId ? { studentId } : {}
    const response = await api.get('/courses', { params })
    return response.data
  },

  async getPublishedCourses(studentId = null) {
    const params = studentId ? { studentId } : {}
    const response = await api.get('/courses/published', { params })
    return response.data
  },

  async getCourseById(id, studentId = null) {
    const params = studentId ? { studentId } : {}
    const response = await api.get(`/courses/${id}`, { params })
    return response.data
  },

  async getInstructorCourses(instructorId) {
    const response = await api.get(`/courses/instructor/${instructorId}`)
    return response.data
  },

  async createCourse(courseData, instructorId) {
    const response = await api.post(`/courses?instructorId=${instructorId}`, courseData)
    return response.data
  },

  async updateCourse(id, courseData) {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  },

  async publishCourse(id) {
    const response = await api.patch(`/courses/${id}/publish`)
    return response.data
  },

  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  }
}