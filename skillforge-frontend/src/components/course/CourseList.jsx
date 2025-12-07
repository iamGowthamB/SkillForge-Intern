// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { fetchPublishedCourses, deleteCourse } from '../../store/slices/courseSlice'
// import { courseService } from '../../services/courseService'
// import { BookOpen, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react'
// import Card from '../common/Card'
// import Loader from '../common/Loader'
// import Button from '../common/Button'
// import toast from 'react-hot-toast'

// const CourseList = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { user } = useSelector((state) => state.auth)
//   const { loading } = useSelector((state) => state.course)
  
//   const [courses, setCourses] = useState([])
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [courseToDelete, setCourseToDelete] = useState(null)
//   const [deleting, setDeleting] = useState(false)

//   useEffect(() => {
//     fetchCourses()
//   }, [user])

//   const fetchCourses = async () => {
//     try {
//       let response
//       if (user?.role === 'INSTRUCTOR') {
//         // Fetch instructor's own courses
//         response = await courseService.getInstructorCourses(user.userId)
//       } else if (user?.role === 'STUDENT') {
//         response = await courseService.getPublishedCourses(user.userId)
//       } else {
//         response = await courseService.getAllCourses()
//       }
      
//       console.log('Fetched courses:', response.data)
//       setCourses(response.data || [])
//     } catch (error) {
//       console.error('Error fetching courses:', error)
//       toast.error('Failed to fetch courses')
//       setCourses([])
//     }
//   }

//   const handleDelete = (e, course) => {
//     e.stopPropagation()
//     setCourseToDelete(course)
//     setShowDeleteModal(true)
//   }

//   const confirmDelete = async () => {
//     if (!courseToDelete) return
    
//     setDeleting(true)
//     try {
//       await courseService.deleteCourse(courseToDelete.id)
      
//       // Remove course from local state immediately
//       setCourses(prevCourses => prevCourses.filter(c => c.id !== courseToDelete.id))
      
//       toast.success('Course deleted successfully!')
//       setShowDeleteModal(false)
//       setCourseToDelete(null)
//     } catch (error) {
//       console.error('Delete error:', error)
//       toast.error('Failed to delete course')
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const handleEdit = (e, courseId) => {
//     e.stopPropagation()
//     navigate(`/courses/edit/${courseId}`)
//   }

//   if (loading) return <Loader />

//   const isInstructor = user?.role === 'INSTRUCTOR'

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {isInstructor ? 'My Courses' : 'All Courses'}
//           </h1>
//           <p className="text-gray-600">
//             {isInstructor ? 'Manage your courses' : 'Browse and enroll in available courses'}
//           </p>
//         </div>
//         {isInstructor && (
//           <Button
//             onClick={() => navigate('/courses/create')}
//             variant="primary"
//             icon={Plus}
//           >
//             Create Course
//           </Button>
//         )}
//       </div>

//       {courses.length === 0 ? (
//         <Card className="p-12 text-center">
//           <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
//           <p className="text-gray-600 mb-4">
//             {isInstructor ? 'Create your first course to get started' : 'Check back later for new courses'}
//           </p>
//           {isInstructor && (
//             <Button onClick={() => navigate('/courses/create')} variant="primary">
//               Create Course
//             </Button>
//           )}
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course) => (
//             <Card
//               key={course.id}
//               hover
             
//               className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
//               // onClick={() => navigate(`/courses/${course.id}`)}
//               onClick={() => {
//                  console.log("Navigating to course:", course.id);
//               //  navigate(`/courses/${course.id}`);
//               navigate(`/courses/${course.id}`, { state: { from: 'courses' } })
              
//               }}
//             >
//               {/* Course Thumbnail - FIXED Issue 2 */}
//               <div className="h-48 relative overflow-hidden" >
//                 {course.thumbnailUrl ? (
//                   <img 
//                     src={course.thumbnailUrl} 
//                     alt={course.title}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.onerror = null
//                       e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
//                       e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-400', 'via-purple-500', 'to-pink-500')
                     
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
//                     <BookOpen size={64} className="text-white opacity-80" />
//                   </div>
//                 )}
//                 {course.isEnrolled && (
//                   <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
//                     Enrolled
//                   </div>
//                 )}
//               </div>

//               <div className="p-6">
//                 <div className="mb-3 flex items-center justify-between">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     course.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
//                     course.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {course.difficultyLevel}
//                   </span>
                  
//                   {/* Show publish status for instructors */}
//                   {isInstructor && (
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       course.isPublished 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {course.isPublished ? 'Published' : 'Draft'}
//                     </span>
//                   )}
//                 </div>

//                 <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
//                   {course.title}
//                 </h3>

//                 <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                   {course.description || 'No description available'}
//                 </p>

//                 <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                   <div className="flex items-center space-x-1">
//                     <Users size={16} />
//                     <span>{course.totalEnrollments || 0} students</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Clock size={16} />
//                     <span>{course.duration || 0} min</span>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t">
//                   <p className="text-sm text-gray-600">
//                     By <span className="font-medium text-gray-900">{course.instructorName}</span>
//                   </p>
//                 </div>

//                 {/* Instructor Actions */}
//                 {isInstructor && (
//                   <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
//                     <Button
//                       onClick={(e) => handleEdit(e, course.id)}
//                       variant="secondary"
//                       size="sm"
//                       icon={Edit}
//                       className="flex-1"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       onClick={(e) => handleDelete(e, course)}
//                       variant="danger"
//                       size="sm"
//                       icon={Trash2}
//                       className="flex-1"
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="max-w-md w-full mx-4 p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete "<strong>{courseToDelete?.title}</strong>"? 
//               This action cannot be undone and will delete all topics and materials.
//             </p>
//             <div className="flex items-center space-x-3">
//               <Button
//                 onClick={confirmDelete}
//                 variant="danger"
//                 className="flex-1"
//                 disabled={deleting}
//               >
//                 {deleting ? 'Deleting...' : 'Delete'}
//               </Button>
//               <Button
//                 onClick={() => {
//                   setShowDeleteModal(false)
//                   setCourseToDelete(null)
//                 }}
//                 variant="secondary"
//                 className="flex-1"
//                 disabled={deleting}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }

// export default CourseList


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import { BookOpen, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react'
import Card from '../common/Card'
import Loader from '../common/Loader'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const CourseList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.course)

  const [courses, setCourses] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [user])

  const getProgressColor = (percent) => {
    if (percent < 30) return "#ef4444"     // RED
    if (percent < 70) return "#facc15"     // YELLOW
    return "#22c55e"                       // GREEN
  }

  const fetchCourses = async () => {
    try {
      let response

      if (user?.role === 'INSTRUCTOR') {
        response = await courseService.getInstructorCourses(user.userId)

      } else if (user?.role === 'STUDENT') {
        response = await courseService.getPublishedCourses(user.userId)

      } else {
        response = await courseService.getAllCourses()
      }

      console.log('Fetched courses:', response.data)
      setCourses(response.data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to fetch courses')
      setCourses([])
    }
  }

  const handleDelete = (e, course) => {
    e.stopPropagation()
    setCourseToDelete(course)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!courseToDelete) return

    setDeleting(true)
    try {
      await courseService.deleteCourse(courseToDelete.id)

      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id))

      toast.success('Course deleted successfully!')
      setShowDeleteModal(false)
      setCourseToDelete(null)

    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete course')

    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (e, courseId) => {
    e.stopPropagation()
    navigate(`/courses/edit/${courseId}`)
  }

  if (loading) return <Loader />

  const isInstructor = user?.role === 'INSTRUCTOR'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isInstructor ? 'My Courses' : 'Browse Courses'}
          </h1>
          <p className="text-gray-600">
            {isInstructor ? 'Manage your courses' : 'Learn and grow your skills'}
          </p>
        </div>

        {isInstructor && (
          <Button
            onClick={() => navigate('/courses/create')}
            variant="primary"
            icon={Plus}
          >
            Create Course
          </Button>
        )}
      </div>

      {/* No Courses */}
      {courses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-600 mb-4">
            {isInstructor ? 'Create your first course to get started' : 'Check back later for new courses'}
          </p>

          {isInstructor && (
            <Button onClick={() => navigate('/courses/create')} variant="primary">
              Create Course
            </Button>
          )}
        </Card>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {courses.map((course) => {

            const progress = course.progressPercent ?? 0 // ⭐ correct source

            return (
              <Card
                key={course.id}
                hover
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                onClick={() => navigate(`/courses/${course.id}`, { state: { from: 'courses' } })}
              >

                {/* Thumbnail */}
                <div className="h-48 relative overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
                        e.target.parentElement.classList.add(
                          'bg-gradient-to-br', 'from-blue-400', 'via-purple-500', 'to-pink-500'
                        )
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                      <BookOpen size={64} className="text-white opacity-80" />
                    </div>
                  )}

                  {/* Enrolled Badge */}
                  {course.isEnrolled && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Enrolled
                    </div>
                  )}

                  {/* ⭐ Bottom Color Progress Bar (Option A) */}
                  {course.isEnrolled && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                      <div className="flex items-center justify-between text-white text-sm mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>

                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: getProgressColor(progress)
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-6">

                  <div className="mb-3 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.difficultyLevel === 'BEGINNER'
                        ? 'bg-green-100 text-green-800'
                        : course.difficultyLevel === 'INTERMEDIATE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.difficultyLevel}
                    </span>

                    {isInstructor && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description || 'No description available'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{course.totalEnrollments || 0} students</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{course.duration || 0} min</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      By <span className="font-medium text-gray-900">{course.instructorName}</span>
                    </p>
                  </div>

                  {/* Student Buttons */}
                  {!isInstructor && (
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/courses/${course.id}`, { state: { from: 'courses' } })
                        }}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        View Details
                      </Button>

                      {!course.isEnrolled && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/courses/${course.id}`, { state: { from: 'courses' } })
                          }}
                          variant="primary"
                          size="sm"
                          className="flex-1"
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Instructor Buttons */}
                  {isInstructor && (
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                      <Button
                        onClick={(e) => handleEdit(e, course.id)}
                        variant="secondary"
                        size="sm"
                        icon={Edit}
                        className="flex-1"
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={(e) => handleDelete(e, course)}
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  )}

                </div>

              </Card>
            )
          })}

        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{courseToDelete?.title}"</strong>?  
              This action cannot be undone.
            </p>

            <div className="flex items-center space-x-3">
              <Button
                onClick={confirmDelete}
                variant="danger"
                className="flex-1"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>

              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                className="flex-1"
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}

export default CourseList
