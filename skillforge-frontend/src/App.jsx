// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Pages
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import StudentDashboard from './components/dashboard/StudentDashboard'
import InstructorDashboard from './components/dashboard/InstructorDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import CourseList from './components/course/CourseList'
import CourseDetail from './components/course/CourseDetail'
import CreateCourse from './components/course/CreateCourse'
import EditCourse from './components/course/EditCourse'
import EnrolledCourses from './components/student/EnrolledCourses'

// Quiz Pages
import QuizPlayPage from './components/quiz/QuizPlayPage'

// Components
import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/common/Navbar'

import ProgressTracker from './components/progress/ProgressTracker'
import LearningPath from './components/progress/LearningPath'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.role === 'STUDENT' && <StudentDashboard />}
              {user?.role === 'INSTRUCTOR' && <InstructorDashboard />}
              {user?.role === 'ADMIN' && <AdminDashboard />}
            </PrivateRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <CourseList />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses/:id"
          element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses/create"
          element={
            <PrivateRoute roles={['INSTRUCTOR']}>
              <CreateCourse />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses/edit/:id"
          element={
            <PrivateRoute roles={['INSTRUCTOR']}>
              <EditCourse />
            </PrivateRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/my-courses"
          element={
            <PrivateRoute roles={['STUDENT']}>
              <EnrolledCourses />
            </PrivateRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <PrivateRoute roles={['STUDENT']}>
              <ProgressTracker />
            </PrivateRoute>
          }
        />

        <Route
          path="/learning-path"
          element={
            <PrivateRoute roles={['STUDENT']}>
              <LearningPath />
            </PrivateRoute>
          }
        />

        {/* Quiz play page (student full page, instructor view/read-only) */}
        <Route
          path="/quiz/play/:quizId"
          element={
            <PrivateRoute>
              <QuizPlayPage />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
