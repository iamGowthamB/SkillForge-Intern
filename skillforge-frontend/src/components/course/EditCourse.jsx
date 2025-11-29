import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourseById, updateCourse } from '../../store/slices/courseSlice'
import { ArrowLeft, Save } from 'lucide-react'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'
import Loader from '../common/Loader'

const EditCourse = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { selectedCourse, loading } = useSelector((state) => state.course)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficultyLevel: 'BEGINNER',
    duration: '',
    thumbnailUrl: ''
  })

  useEffect(() => {
    dispatch(fetchCourseById({ id, studentId: user?.userId }))
  }, [dispatch, id, user])

  useEffect(() => {
    if (selectedCourse) {
      setFormData({
        title: selectedCourse.title || '',
        description: selectedCourse.description || '',
        difficultyLevel: selectedCourse.difficultyLevel || 'BEGINNER',
        duration: selectedCourse.duration || '',
        thumbnailUrl: selectedCourse.thumbnailUrl || ''
      })
    }
  }, [selectedCourse])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateCourse({ id, courseData: formData }))
    
    if (result.type === 'course/updateCourse/fulfilled') {
      navigate(`/courses/${id}`)
    }
  }

  const handleCancel = () => {
    navigate(`/courses/${id}`)
  }

  if (loading && !selectedCourse) return <Loader />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Course</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Course</h1>
        <p className="text-gray-600">Update your course details</p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Course Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Introduction to Web Development"
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students will learn in this course..."
              rows="4"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <Input
              label="Duration (minutes)"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 120"
            />
          </div>

          <Input
            label="Thumbnail URL (Optional)"
            type="url"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />

          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              icon={Save}
            >
              {loading ? 'Updating...' : 'Update Course'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default EditCourse