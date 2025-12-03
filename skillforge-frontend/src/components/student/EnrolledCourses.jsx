// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { enrollmentService } from '../../services/enrollmentService'
// import { courseService } from '../../services/courseService'
// import { BookOpen, Clock, Award, TrendingUp, Play, X } from 'lucide-react'
// import Card from '../common/Card'
// import Loader from '../common/Loader'
// import Button from '../common/Button'
// import toast from 'react-hot-toast'

// const EnrolledCourses = () => {
//   const navigate = useNavigate()
//   const { user } = useSelector((state) => state.auth)
//   const [enrolledCourses, setEnrolledCourses] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchEnrolledCourses()
//   }, [user])

//   const getProgressColor = (percent) => {
//     if (percent < 30) return "#ef4444" // red
//     if (percent < 70) return "#facc15" // yellow
//     return "#22c55e" // green
//   }

//   const fetchEnrolledCourses = async () => {
//     try {
//       setLoading(true)
//       const enrollments = await enrollmentService.getStudentEnrollments(user.userId)

//       console.log("Enrollments fetched:", enrollments)

//       const coursesPromises = enrollments.map(async (enrollment) => {
//         // const courseResponse = await courseService.getCourseById(enrollment.courseId, user.userId)
//         const courseResponse = await courseService.getCourseById(enrollment.courseId, user.role === "STUDENT" ? user.userId : null

//         );
//         console.log("Course fetched for enrollment:", courseResponse)
//         return {
//           ...courseResponse.data,      // Contains: progressPercent
//           enrollment: enrollment       // Contains: isCompleted
//         }
//       })

//       const courses = await Promise.all(coursesPromises)
//       setEnrolledCourses(courses)
//     } catch (error) {
//       console.error('Error fetching enrolled courses:', error)
//       toast.error('Failed to fetch enrolled courses')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUnenroll = async (courseId, courseTitle) => {
//     if (window.confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
//       try {
//         await enrollmentService.unenrollCourse(user.userId, courseId)
//         toast.success('Unenrolled successfully!')
//         fetchEnrolledCourses()
//       } catch (error) {
//         toast.error('Failed to unenroll')
//       }
//     }
//   }

//   if (loading) return <Loader />

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">My Enrolled Courses</h1>
//         <p className="text-gray-600">Continue your learning journey</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Total Enrolled</p>
//               <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
//             </div>
//             <div className="bg-blue-500 p-3 rounded-lg">
//               <BookOpen size={24} className="text-white" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Completed</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {enrolledCourses.filter(c => c.enrollment?.isCompleted).length}
//               </p>
//             </div>
//             <div className="bg-green-500 p-3 rounded-lg">
//               <Award size={24} className="text-white" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">In Progress</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {enrolledCourses.filter(c => !c.enrollment?.isCompleted).length}
//               </p>
//             </div>
//             <div className="bg-yellow-500 p-3 rounded-lg">
//               <TrendingUp size={24} className="text-white" />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {enrolledCourses.length > 0
//                   ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progressPercent ?? 0), 0) / enrolledCourses.length)
//                   : 0}%
//               </p>
//             </div>
//             <div className="bg-purple-500 p-3 rounded-lg">
//               <Clock size={24} className="text-white" />
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Enrolled Courses Grid */}
//       {enrolledCourses.length === 0 ? (
//         <Card className="p-12 text-center">
//           <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
//           <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
//           <Button onClick={() => navigate('/courses')} variant="primary">
//             Browse Courses
//           </Button>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {enrolledCourses.map((course) => {
//             const progress = course.progressPercent ?? 0

//             return (
//               <Card key={course.id ?? course.enrollment?.courseId} hover className="overflow-hidden">
//                 <div
//                   className="h-48 relative overflow-hidden cursor-pointer"
//                   // onClick={() => navigate(`/courses/${course.id}`)}
//                   onClick={() =>
//                     navigate(`/courses/${course.id}`, {
//                       state: { from: "enrolled", courseId: course.id }
//                     })
//                   }

//                 >
//                   {course.thumbnailUrl ? (
//                     <img
//                       src={course.thumbnailUrl}
//                       alt={course.title}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.style.display = 'none'
//                         e.target.nextSibling.style.display = 'flex'
//                       }}
//                     />
//                   ) : null}

//                   <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
//                     style={course.thumbnailUrl ? { display: 'none' } : {}}>
//                     <BookOpen size={64} className="text-white opacity-80" />
//                   </div>

//                   {/* Progress Overlay */}
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//                     <div className="flex items-center justify-between text-white text-sm mb-2">
//                       <span>Progress</span>
//                       <span>{progress}%</span>
//                     </div>

//                     <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
//                       <div
//                         className="h-full transition-all duration-300"
//                         style={{
//                           width: `${progress}%`,
//                           backgroundColor: getProgressColor(progress)
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="mb-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium 
//                       ${course.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
//                         course.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                       }`}>
//                       {course.difficultyLevel}
//                     </span>
//                   </div>

//                   <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
//                     {course.title}
//                   </h3>

//                   <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                     {course.description}
//                   </p>

//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                     <span>{course.totalTopics || 0} topics</span>
//                     <span>By {course.instructorName}</span>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <Button
//                       // onClick={() => navigate(`/courses/${course.id}`)}
//                       onClick={() =>
//                         navigate(`/courses/${course.id}`, {
//                           state: {  from: "enrolled", courseId: course.id }
//                         })
//                       }

//                       variant="primary"
//                       size="sm"
//                       icon={Play}
//                       className="flex-1"
//                     >
//                       Continue
//                     </Button>
//                     <Button
//                       onClick={() => handleUnenroll(course.id, course.title)}
//                       variant="danger"
//                       size="sm"
//                       icon={X}
//                     >
//                       Unenroll
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }

// export default EnrolledCourses


import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { enrollmentService } from '../../services/enrollmentService'
import { courseService } from '../../services/courseService'
import { BookOpen, Clock, Award, TrendingUp, Play, X } from 'lucide-react'
import Card from '../common/Card'
import Loader from '../common/Loader'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const EnrolledCourses = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnrolledCourses()
  }, [user])

  const getProgressColor = (percent) => {
    if (percent < 30) return "#ef4444"
    if (percent < 70) return "#facc15"
    return "#22c55e"
  }

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true)

      const enrollments = await enrollmentService.getStudentEnrollments(user.userId)
      console.log("Enrollments fetched:", enrollments)

      const coursesPromises = enrollments.map(async (enrollment) => {
        const courseResponse = await courseService.getCourseById(
          enrollment.courseId,
          user.role === "STUDENT" ? user.userId : null
        )

        // FIX: extract actual course data
        const courseData = courseResponse.data?.data ?? courseResponse.data

        console.log("Course fetched:", courseData)

        return {
          ...courseData,
          enrollment: enrollment
        }
      })

      const courses = await Promise.all(coursesPromises)
      setEnrolledCourses(courses)
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      toast.error('Failed to fetch enrolled courses')
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
      try {
        await enrollmentService.unenrollCourse(user.userId, courseId)
        toast.success('Unenrolled successfully!')
        fetchEnrolledCourses()
      } catch (error) {
        toast.error('Failed to unenroll')
      }
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Enrolled Courses</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Enrolled</p>
              <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {enrolledCourses.filter(c => c.enrollment?.isCompleted).length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Award size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {enrolledCourses.filter(c => !c.enrollment?.isCompleted).length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {enrolledCourses.length > 0
                  ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progressPercent ?? 0), 0) / enrolledCourses.length)
                  : 0}%
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Enrolled Courses Grid */}
      {enrolledCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
          <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
          <Button onClick={() => navigate('/courses')} variant="primary">
            Browse Courses
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = course.progressPercent ?? 0

            return (
              <Card
                key={course.id}
                hover
                className="overflow-hidden"
              >
                <div
                  className="h-48 relative overflow-hidden cursor-pointer"
                  onClick={() =>
                    navigate(`/courses/${course.id}`, {
                      state: { from: "enrolled", courseId: course.id }
                    })
                  }
                >
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}

                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
                    style={course.thumbnailUrl ? { display: 'none' } : {}}>
                    <BookOpen size={64} className="text-white opacity-80" />
                  </div>

                  {/* Progress Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
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
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${course.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                        course.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {course.difficultyLevel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.totalTopics || 0} topics</span>
                    <span>By {course.instructorName}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() =>
                        navigate(`/courses/${course.id}`, {
                          state: { from: "enrolled", courseId: course.id }
                        })
                      }
                      variant="primary"
                      size="sm"
                      icon={Play}
                      className="flex-1"
                    >
                      Continue
                    </Button>
                    <Button
                      onClick={() => handleUnenroll(course.id, course.title)}
                      variant="danger"
                      size="sm"
                      icon={X}
                    >
                      Unenroll
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourses
