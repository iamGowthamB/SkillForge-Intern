import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { courseService } from '../../services/courseService'
import { BookOpen, Users, Award, TrendingUp, Plus, Edit, Eye, EyeOff } from 'lucide-react'
import Card from '../common/Card'
import Button from '../common/Button'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.userId) {
      fetchCourses()
    }
  }, [user])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseService.getInstructorCourses(user.userId)
      console.log('Instructor courses:', response.data)
      setCourses(response.data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to fetch courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handlePublishToggle = async (courseId, currentStatus) => {
    try {
      if (!currentStatus) {
        // Publish the course
        await courseService.publishCourse(courseId)
        toast.success('Course published successfully!')
      } else {
        toast.info('Unpublish feature coming soon!')
        return
      }
      
      // Refresh courses
      await fetchCourses()
    } catch (error) {
      toast.error('Failed to update course status')
    }
  }

  // Calculate real stats from courses
  const publishedCourses = courses.filter(c => c.isPublished)
  const draftCourses = courses.filter(c => !c.isPublished)
  const totalStudents = courses.reduce((sum, c) => sum + (c.totalEnrollments || 0), 0)

  const stats = [
    { 
      label: 'Total Courses', 
      value: courses.length.toString(), 
      icon: BookOpen, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Total Students', 
      value: totalStudents.toString(), 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Published', 
      value: publishedCourses.length.toString(), 
      icon: Award, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Draft', 
      value: draftCourses.length.toString(), 
      icon: TrendingUp, 
      color: 'bg-yellow-500' 
    }
  ]

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600">Manage your courses and track student progress</p>
        </div>
        <Button
          onClick={() => navigate('/courses/create')}
          variant="primary"
          icon={Plus}
        >
          Create Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Draft vs Published Explanation */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">i</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">About Draft & Published Courses</h3>
            <p className="text-sm text-blue-800">
              <strong>Draft:</strong> Courses that are not visible to students. Use this to prepare content before making it public.<br/>
              <strong>Published:</strong> Courses that are live and visible to students. Click the "Publish" button to make a draft course available to students.
            </p>
          </div>
        </div>
      </Card>

      {/* My Courses */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <Button
            onClick={() => navigate('/courses')}
            variant="outline"
            size="sm"
          >
            View All
          </Button>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Create your first course to get started</p>
            <Button
              onClick={() => navigate('/courses/create')}
              variant="primary"
            >
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  // onClick={() => navigate(`/courses/${course.id}`)}
                  onClick={() => navigate(`/courses/${course.id}`, { state: { from: 'dashboard' } })}
                >
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.isPublished ? '✓ Published' : '○ Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {course.totalEnrollments || 0} students • {course.totalTopics || 0} topics
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!course.isPublished && (
                    <Button
                      onClick={() => handlePublishToggle(course.id, course.isPublished)}
                      variant="success"
                      size="sm"
                      icon={Eye}
                    >
                      Publish
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate(`/courses/edit/${course.id}`)}
                    variant="secondary"
                    size="sm"
                    icon={Edit}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default InstructorDashboard