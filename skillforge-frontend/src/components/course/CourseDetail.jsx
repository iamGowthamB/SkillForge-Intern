// src/components/course/CourseDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { courseService } from '../../services/courseService'
import { topicService } from '../../services/topicService'
import { materialService } from '../../services/materialService'
import { enrollmentService } from '../../services/enrollmentService'
import MaterialViewer from '../material/MaterialViewer'
import QuizPlayer from '../quiz/QuizPlayer'
import AIQuizGenerator from '../quiz/AIQuizGenerator'
import {
  ArrowLeft, BookOpen, Users, Clock, Award, Play, FileText,
  CheckCircle, Plus, Edit, Trash2, Upload, ChevronDown, ChevronUp, X
} from 'lucide-react'
import Card from '../common/Card'
import Loader from '../common/Loader'
import Button from '../common/Button'
import Input from '../common/Input'
import toast from 'react-hot-toast'
import { quizService } from '../../services/quizService'
import api from "../../services/api";
import { progressService } from "../../services/progressService";


const CourseDetail = () => {
  // const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  const [course, setCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [materials, setMaterials] = useState({})
  const [loading, setLoading] = useState(true)
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  const [showTopicModal, setShowTopicModal] = useState(false)
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [selectedTopicForMaterial, setSelectedTopicForMaterial] = useState(null)
  const [courseProgress, setCourseProgress] = useState(null);


  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    level: 'BEGINNER',
    orderIndex: 0
  })

  const [materialForm, setMaterialForm] = useState({
    type: 'VIDEO',
    title: '',
    description: '',
    link: '',
    file: null
  })

  // New states for quiz interactions
  const [showAIQuizModal, setShowAIQuizModal] = useState(false)
  const [aiQuizModalTopicId, setAiQuizModalTopicId] = useState(null)
  const [generatingQuiz, setGeneratingQuiz] = useState(false)

  // const params = useParams();
  const isInstructor = user?.role === 'INSTRUCTOR'
  const isStudent = user?.role === 'STUDENT'
    // -----------------------------
  // 1️⃣ SAFE COURSE ID EXTRACTION
let { id } = useParams();

const fallbackId =
  location.state?.courseId ||
  location.state?.recommendedCourseId ||
  location.state?.course?.id;

const courseId = Number(id || fallbackId);


 

  const handleBack = () => {
    if (location.state?.from === 'dashboard') {
      navigate('/dashboard')
    } else if (location.state?.from === 'courses') {
      navigate('/courses')
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
     if (!courseId || isNaN(courseId)) {
    console.error("Course ID missing!");
    toast.error("Invalid Course ID");
    setLoading(false);
    return;
  }
    fetchCourseData()
  }, [courseId, user])

  useEffect(() => {
    if (location.state?.recommendedTopicId && topics.length > 0) {

      const topicId = location.state.recommendedTopicId;

      setExpandedTopic(topicId);
      fetchMaterials(topicId);

      // clear the state so reopens correctly only once
      navigate(location.pathname, { replace: true });
    }
  }, [location.state?.forceReload, topics]);



  const fetchCourseData = async () => {
    setLoading(true);

    // primary: URL param
    // const idFromParams = params?.id;

    // // fallback from navigation state
    // const idFromState =
    //   location?.state?.courseId || location?.state?.recommendedCourseId;

    // const courseId = idFromParams ?? idFromState;

    if (!courseId) {
      console.error("Course id missing!");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching course:", courseId);
      console.log("User Role "+user.role)
      // const res = await courseService.getCourseById(courseId, user?.userId);

      const res = await courseService.getCourseById(
        courseId,
        user.role === "STUDENT" ?  user.userId : null
        
      );


      // extract actual course object
      const courseData = res?.data?.data ?? res?.data ?? res;

      if (!courseData) {
        console.error("No course data received");
        setLoading(false);
        return;
      }

      // -----------------------------
      // SET STATE PROPERLY
      // -----------------------------
      setCourse(courseData);
      setIsEnrolled(courseData?.isEnrolled || false);


      // topics
      let topicList = [];
      if (Array.isArray(courseData.topics)) {
        topicList = courseData.topics;
        setTopics(courseData.topics);
      } else {
        const topicRes = await topicService.getTopicsByCourse(courseId);
        topicList = topicRes || [];
        setTopics(topicRes || []);
      }


      // fetch progress from global student progress endpoint
     
      await loadProgress(courseId, topicList);
      

      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course");
      setLoading(false);
    }
  };

  //   const fetchCourseProgress = async (courseId) => {
  //   try {
  //     const res = await progressService.getStudentProgress(user.studentId);

  //     const list = res?.data?.data ?? res?.data ?? [];

  //     // find progress for THIS course
  //     const progress = list.find(p => p.courseId === Number(courseId));

  //     if (progress) {
  //       setCourseProgress({
  //         percentage: progress.completionPercentage || 0,
  //         completedTopics: progress.completedTopics || 0,
  //         totalTopics: progress.totalTopics || topics.length || 0
  //       });
  //     } else {
  //       // student enrolled but no progress record yet
  //       setCourseProgress({
  //         percentage: 0,
  //         completedTopics: 0,
  //         totalTopics: topics.length || 0
  //       });
  //     }

  //   } catch (err) {
  //     console.error("Course progress fetch error:", err);
  //   }
  // };

  // ----------------------------
  //  Progress Calculation
  // ----------------------------
  const loadProgress = async (courseId, topicList) => {
    try {
      const res = await progressService.getStudentProgress(user.studentId);
      const list = res?.data?.data ?? [];

      const record = list.find((p) => p.courseId === Number(courseId));

      const totalTopics = topicList.length;
      const percentage = record?.completionPercentage ?? 0;

      // auto-calculated completed topics
      const completedTopics = Math.round((percentage / 100) * totalTopics);

      setCourseProgress({
        percentage,
        completedTopics,
        totalTopics
      });

    } catch (err) {
      console.error("Progress loading failed:", err);
    }
  };

  const fetchMaterials = async (topicId) => {
    try {
      const response = await materialService.getMaterialsByTopic(topicId)
      setMaterials(prev => ({
        ...prev,
        [topicId]: response || []
      }))
    } catch (error) {
      console.error('Error fetching materials:', error)
      toast.error('Failed to load materials')
    }
  }

  const toggleTopic = async (topicId) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null)
    } else {
      setExpandedTopic(topicId)
      if (!materials[topicId]) {
        await fetchMaterials(topicId)
      }
    }
  }

  const handleEnroll = async () => {
    if (!isStudent) {
      toast.error('Only students can enroll in courses')
      return
    }
    setEnrolling(true)
    try {
      await enrollmentService.enrollCourse(user.userId, courseId)
      toast.success('Enrolled successfully!')
      setIsEnrolled(true)
      await fetchCourseData()
    } catch (error) {
      console.error('Enrollment error:', error)
      toast.error('Failed to enroll in course')
    } finally {
      setEnrolling(false)
    }
  }

  const handleTopicSubmit = async (e) => {
    e.preventDefault()
    try {
      await topicService.createTopic({
        ...topicForm,
        courseId: courseId
      })

      toast.success('Topic created successfully!')
      setShowTopicModal(false)
      setTopicForm({ name: '', description: '', level: 'BEGINNER', orderIndex: 0 })

      const topicsResponse = await topicService.getTopicsByCourse(id)
      setTopics(topicsResponse || [])
    } catch (error) {
      console.error('Topic creation error:', error)
      toast.error('Failed to create topic')
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await topicService.deleteTopic(topicId)
        toast.success('Topic deleted successfully!')

        setTopics(prev => prev.filter(t => t.id !== topicId))

        setMaterials(prev => {
          const newMaterials = { ...prev }
          delete newMaterials[topicId]
          return newMaterials
        })
      } catch (error) {
        console.error('Topic deletion error:', error)
        toast.error('Failed to delete topic')
      }
    }
  }

  const handleMaterialSubmit = async (e) => {
    e.preventDefault()

    try {
      if (materialForm.type === 'LINK') {
        // For external links - use URL-encoded format
        const linkData = {
          topicId: selectedTopicForMaterial,
          title: materialForm.title,
          description: materialForm.description || '',
          link: materialForm.link
        }

        await materialService.createLinkMaterial(linkData)
      } else {
        // For file uploads (VIDEO, PDF)
        if (!materialForm.file) {
          toast.error('Please select a file to upload')
          return
        }

        const formData = new FormData()
        formData.append('topicId', selectedTopicForMaterial)
        formData.append('title', materialForm.title)
        formData.append('description', materialForm.description || '')
        formData.append('materialType', materialForm.type)
        formData.append('file', materialForm.file)

        await materialService.uploadMaterial(formData)
      }

      toast.success('Material uploaded successfully!')
      closeMaterialModal()

      await fetchMaterials(selectedTopicForMaterial)
    } catch (error) {
      console.error('Material upload error:', error)
      toast.error(error.response?.data || 'Failed to upload material')
    }
  }

  const handleDeleteMaterial = async (materialId, topicId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await materialService.deleteMaterial(materialId)
        toast.success('Material deleted successfully!')
        await fetchMaterials(topicId)
      } catch (error) {
        console.error('Material deletion error:', error)
        toast.error('Failed to delete material')
      }
    }
  }

  const closeMaterialModal = () => {
    setShowMaterialModal(false)
    setSelectedTopicForMaterial(null)
    setMaterialForm({ type: 'VIDEO', title: '', description: '', link: '', file: null })
  }

  const getMaterialIcon = (type) => {
    const icons = {
      VIDEO: {
        component: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>,
        color: 'text-red-500',
        bg: 'bg-red-50'
      },
      PDF: {
        component: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>,
        color: 'text-blue-500',
        bg: 'bg-blue-50'
      },
      LINK: {
        component: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
        color: 'text-green-500',
        bg: 'bg-green-50'
      },
      TEXT: {
        component: <FileText className="w-5 h-5" />,
        color: 'text-purple-500',
        bg: 'bg-purple-50'
      }
    }
    return icons[type] || icons.PDF
  }

  // --- QUIZ HANDLERS ---
  const handleStartQuiz = async (topic) => {
    try {
      // fetch latest quiz for this topic
      const res = await quizService.getQuizByTopic(topic.id)
      const quiz = res?.data || res // try to support both shapes
      if (!quiz) {
        toast('No quiz found for this topic. Instructors can generate one.', { icon: 'ℹ️' })
        return
      }
      // Students go to play page
      if (isStudent) {
        // navigate(`/quiz/play/${quiz.id}`, { state: { topicId: topic.id } })
        // Student
        navigate(`/quiz/play/${quiz.id}`, { state: { topicId: topic.id, quizId: quiz.id } })

      } else {
        // Instructors can also view (read-only) - navigate to same player with readonly flag
        navigate(`/quiz/play/${quiz.id}`, { state: { readonly: true, topicId: topic.id } })
      }
    } catch (err) {
      console.error('Start quiz error', err)
      toast.error('Failed to load quiz')
    }
  }

  const handleViewQuiz = async (topic) => {
    try {
      const res = await quizService.getQuizByTopic(topic.id)
      const quiz = res?.data || res
      // const quiz = res

      if (!quiz) {
        toast('No quiz found to view', { icon: 'ℹ️' })
        return
      }
      // navigate(`/quiz/play/${quiz.id}`, { state: { readonly: true, topicId: topic.id } })
      // New: navigate with same URL AND pass quizId explicitly in state (fallback)
      navigate(`/quiz/play/${quiz.id}`, { state: { readonly: true, topicId: topic.id, quizId: quiz.id } })

    } catch (err) {
      console.error('View quiz error', err)
      toast.error('Failed to open quiz')
    }
  }

  const handleOpenGenerateModal = (topicId) => {
    setAiQuizModalTopicId(topicId)
    setShowAIQuizModal(true)
  }

  const handleAIGeneratedSaved = async (savedQuiz) => {
    // savedQuiz may be returned depending on AI component/service implementation
    setShowAIQuizModal(false)
    toast.success('AI Quiz saved successfully')
    // Optionally refresh topics / materials or other UI
    // If your API created a quiz tied to topic, nothing else required. But we can refresh data:
    await fetchCourseData()
  }

  const getProgressColor = (percent) => {
  if (percent < 30) return "#ef4444";  // red
  if (percent < 70) return "#facc15";  // yellow
  return "#22c55e";                    // green
};

  if (loading || !course) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={handleBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card>
            <div className="h-64 md:h-96 relative overflow-hidden">
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
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center" style={course.thumbnailUrl ? { display: 'none' } : {}}>
                <BookOpen size={96} className="text-white opacity-80" />
              </div>
              {isEnrolled && (
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-medium flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Enrolled</span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${course.difficultyLevel === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                  course.difficultyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {course.difficultyLevel}
                </span>
                {isInstructor && (
                  <Button
                    onClick={() => navigate(`/courses/edit/${id}`)}
                    variant="secondary"
                    size="sm"
                    icon={Edit}
                  >
                    Edit Course
                  </Button>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>


              <p className="text-gray-600 text-lg mb-6">
                {course.description || 'No description available.'}
              </p>

              {/* {isStudent && isEnrolled && courseProgress && (
  <div className="mb-6 bg-white/70 border border-gray-200 shadow-sm rounded-xl p-4">
    <p className="text-sm font-medium text-gray-600">Your Progress</p>

    <div className="flex items-center justify-between mt-2">
      <span className="text-xl font-bold text-gray-900">
        {courseProgress.percentage}%
      </span>
      <span className="text-sm text-gray-500">
        {courseProgress.completedTopics} / {courseProgress.totalTopics} topics
      </span>
    </div>

    <div className="mt-3 w-full bg-gray-200 h-3 rounded-full overflow-hidden">
      <div
        className="bg-green-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${courseProgress.percentage}%` }}
      ></div>
    </div>
  </div>
)} */}
              {/* =================== PROGRESS BLOCK =================== */}
              {isStudent && isEnrolled && courseProgress && (
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-600">Your Progress</p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold">
                      {courseProgress.percentage}%
                    </span>

                    <span className="text-sm text-gray-500">
                      {courseProgress.completedTopics} / {courseProgress.totalTopics} topics
                    </span>
                  </div>

                  {/* <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${courseProgress.percentage}%` }}
                    />
                  </div> */}
                  <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full transition-all duration-500"
    style={{
      width: `${courseProgress.percentage}%`,
      backgroundColor: getProgressColor(courseProgress.percentage)
    }}
  />
</div>

                </div>
              )}


              <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users size={20} />
                  <span className="text-sm">{course.totalEnrollments || 0} students</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={20} />
                  <span className="text-sm">{course.duration || 0} minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FileText size={20} />
                  <span className="text-sm">{topics.length} topics</span>
                </div>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">Instructor</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {course.instructorName?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{course.instructorName}</p>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Topics & Materials */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              {isInstructor && (
                <Button
                  onClick={() => setShowTopicModal(true)}
                  variant="primary"
                  size="sm"
                  icon={Plus}
                >
                  Add Topic
                </Button>
              )}
            </div>

            {topics.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No topics added yet</p>
                {isInstructor && (
                  <Button
                    onClick={() => setShowTopicModal(true)}
                    variant="primary"
                    size="sm"
                    className="mt-4"
                  >
                    Add First Topic
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic, index) => {
                  const topicMaterials = materials[topic.id] || []

                  return (
                    <div key={topic.id} className="border border-gray-200 rounded-lg">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleTopic(topic.id)}
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                            <p className="text-sm text-gray-500">
                              {topicMaterials.length} material{topicMaterials.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isInstructor && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTopicForMaterial(topic.id)
                                  setShowMaterialModal(true)
                                }}
                                variant="secondary"
                                size="sm"
                                icon={Plus}
                              >
                                Add Material
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTopic(topic.id)
                                }}
                                variant="danger"
                                size="sm"
                                icon={Trash2}
                              />
                            </>
                          )}
                          {expandedTopic === topic.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      {/* Materials Display */}
                      {expandedTopic === topic.id && (
                        <>
                          <div className="border-t border-gray-200 p-4 bg-gray-50">
                            {topic.description && (
                              <p className="text-sm text-gray-600 mb-4">{topic.description}</p>
                            )}

                            {topicMaterials.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-4">No materials added yet</p>
                            ) : (
                              <div className="space-y-2">
                                {topicMaterials.map((material) => {
                                  const iconData = getMaterialIcon(material.materialType)
                                  return (
                                    <div
                                      key={material.id}
                                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                                      // onClick={() => setSelectedMaterial(material)}
                                      onClick={() => setSelectedMaterial({ ...material, topicId: topic.id })}

                                    >
                                      <div className="flex items-center space-x-3 flex-1">
                                        <div className={`${iconData.bg} p-2 rounded-lg`}>
                                          <div className={iconData.color}>
                                            {iconData.component}
                                          </div>
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900">{material.title}</p>
                                          {material.description && (
                                            <p className="text-xs text-gray-500">{material.description}</p>
                                          )}
                                          <p className="text-xs text-gray-400 mt-1">
                                            {material.materialType} • Click to view
                                          </p>
                                        </div>
                                      </div>
                                      {isInstructor && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteMaterial(material.id, topic.id)
                                          }}
                                          variant="danger"
                                          size="sm"
                                          icon={Trash2}
                                        />
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* ===== NEW: Quiz Section (right under materials list) ===== */}
                          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 12a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">Quiz</h4>
                                  <p className="text-sm text-gray-600">Test your understanding of this topic</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {isStudent && (
                                  <Button
                                    onClick={() => handleStartQuiz(topic)}
                                    variant="primary"
                                    size="sm"
                                    icon={Play}
                                  >
                                    Start Quiz
                                  </Button>
                                )}

                                {isInstructor && (
                                  <>
                                    <Button
                                      onClick={() => handleOpenGenerateModal(topic.id)}
                                      variant="secondary"
                                      size="sm"
                                      className="bg-white border border-purple-300 text-purple-700 hover:bg-purple-50"
                                    >
                                      Generate
                                    </Button>

                                    <Button
                                      onClick={() => handleViewQuiz(topic)}
                                      variant="primary"
                                      size="sm"
                                      className="bg-purple-600 border-purple-600"
                                    >
                                      View Quiz
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Small hint line */}
                            <p className="mt-3 text-xs text-gray-500">
                              {isInstructor ? 'Generate a quiz using AI or view the latest saved quiz (read-only).' :
                                'Start the latest quiz for this topic. If no quiz exists ask your instructor to generate one.'}
                            </p>
                          </div>
                          {/* ===== end quiz section ===== */}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">Free</span>
                <Award size={32} className="text-yellow-500" />
              </div>

              {isEnrolled ? (
                <Button variant="success" size="lg" className="w-full" icon={Play}>
                  Continue Learning
                </Button>
              ) : isStudent ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Login as student to enroll</p>
                </div>
              )}

              <div className="pt-6 border-t space-y-3">
                <h3 className="font-semibold text-gray-900">This course includes:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>{topics.length} comprehensive topics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span>AI-powered quizzes</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <Card className="max-w-lg w-full p-6 border-2 border-blue-400 shadow-xl rounded-2xl bg-white/90 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Topic</h3>
              <button onClick={() => setShowTopicModal(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <Input
                label="Topic Name"
                value={topicForm.name}
                onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                required
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                <select
                  value={topicForm.level}
                  onChange={(e) => setTopicForm({ ...topicForm, level: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">Add Topic</Button>
                <Button type="button" variant="secondary" onClick={() => setShowTopicModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <Card className="max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto border-2 border-purple-400 shadow-xl rounded-2xl bg-white/90 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Material</h3>
              <button onClick={closeMaterialModal}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={handleMaterialSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Material Type</label>
                <select
                  value={materialForm.type}
                  onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value, file: null, link: '' })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF Document</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>

              <Input
                label="Title"
                value={materialForm.title}
                onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                required
                placeholder="Enter material title"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter description"
                />
              </div>

              {materialForm.type === 'LINK' ? (
                <Input
                  label="Link URL"
                  type="url"
                  value={materialForm.link}
                  onChange={(e) => setMaterialForm({ ...materialForm, link: e.target.value })}
                  placeholder="https://example.com or https://youtube.com/watch?v=..."
                  required
                />
              ) : (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                    accept={materialForm.type === 'VIDEO' ? 'video/*' : 'application/pdf'}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  {materialForm.file && (
                    <p className="text-xs text-gray-600 mt-1">
                      Selected: {materialForm.file.name} ({(materialForm.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {materialForm.type === 'VIDEO' ? 'Max size: 500MB' : 'Max size: 50MB'}
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1" icon={Upload}>
                  Upload Material
                </Button>
                <Button type="button" variant="secondary" onClick={closeMaterialModal} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* AI Quiz Generator Modal (Instructor) */}
      {showAIQuizModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 p-4 transition-all duration-300">
          <Card className="max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto border-2 border-purple-400 shadow-xl rounded-2xl bg-white/90 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">AI Quiz Generator</h3>
              <button onClick={() => setShowAIQuizModal(false)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* UPDATED: Passing instructorId, courseId, topicId */}
            <AIQuizGenerator
              instructorId={user?.userId}
              courseId={courseId}
              topicId={aiQuizModalTopicId}
            />
          </Card>
        </div>
      )}


      {/* Material Viewer */}
      {selectedMaterial && (

        <MaterialViewer
          material={selectedMaterial}
          topicId={selectedMaterial?.topicId}
          onClose={() => setSelectedMaterial(null)}
        />

      )}
    </div>
  )
}

export default CourseDetail

