// src/components/dashboard/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { courseService } from "../../services/courseService";
import { adaptiveService } from "../../services/adaptiveService";

import Card from "../common/Card";
import Loader from "../common/Loader";
import Button from "../common/Button";
import toast from "react-hot-toast";
import ProgressTracker from "../progress/ProgressTracker";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [courses, setCourses] = useState([]);
  const [nextSuggestion, setNextSuggestion] = useState(null);
  const [suggestedCourseId, setSuggestedCourseId] = useState(null); // <-- store course id we asked about
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await courseService.getPublishedCourses(user?.userId);
      // defensive: the service might return data in res.data or res.data.data depending on API standardization
      const courseList = res?.data?.data ?? res?.data ?? [];
      setCourses(courseList || []);

      // Fetch AI adaptive recommendation for FIRST course (optional)
      if ((courseList?.length || 0) > 0) {
        const firstCourse = courseList[0];
        setSuggestedCourseId(firstCourse?.id ?? null);

        const suggestionResp = await adaptiveService.getNextTopic(
          user?.userId,
          firstCourse?.id
        );

        // adaptiveService likely returns { data: { data: <topic> } } or { data: <topic> }
        const topic = suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
        setNextSuggestion(topic);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const enrolled = courses.filter((c) => c.isEnrolled);
  const completed = enrolled.filter((c) => c.isCompleted);
  const inProgress = enrolled.filter((c) => !c.isCompleted);

  const stats = [
    {
      label: "Enrolled",
      value: enrolled.length,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: Award,
      color: "from-green-500 to-green-600",
    },
    {
      label: "In Progress",
      value: inProgress.length,
      icon: TrendingUp,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Available",
      value: courses.length,
      icon: Clock,
      color: "from-purple-500 to-purple-600",
    },
  ];

 const getCourseProgressValue = (course) => {
    return (
      course?.progressPercent ??
      course?.completionPercentage ??
      course?.progressPercentage ??
      course?.progress?.completionPercentage ??
      course?.enrollment?.completionPercentage ??
      0
    );
};


  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-6 rounded-2xl shadow bg-white border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">{item.label}</p>
                  <p className="text-3xl font-bold mt-1">{item.value}</p>
                </div>
                <div
                  className={`p-4 rounded-xl bg-gradient-to-br ${item.color}`}
                >
                  <Icon className="text-white" size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation */}
      {nextSuggestion && (
        <Card className="p-7 mb-10 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow">
          <div className="flex items-center space-x-4">
            <Sparkles size={32} className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Next Suggested Topic For You
              </h2>

              <p className="text-gray-700 mt-1 font-medium">
                {nextSuggestion?.name ?? "(Untitled topic)"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {nextSuggestion?.description ?? ""}
              </p>

              <Button
                onClick={() => {
                  // Prefer the course id that we actually asked for (safe), fallback to any courseId on topic if present
                  const cid = suggestedCourseId ?? nextSuggestion?.courseId ?? nextSuggestion?.course?.id;
                  if (!cid) {
                    toast.error("Course id not available for navigation.");
                    return;
                  }

                  navigate(`/courses/${cid}`, {
                    state: {
                      recommendedTopicId: nextSuggestion?.id,
                      forceReload: Date.now(),
                    },
                  });
                }}
                className="mt-3 flex items-center gap-2"
              >
                Go to Topic <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Progress Section */}
      <ProgressTracker />

      {/* Courses Section */}
      <div className="flex items-center justify-between mt-10 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
        <Button onClick={() => navigate("/courses")} variant="outline">
          View All
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">
            No courses yet!
          </h3>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course) => {
            const progressVal = getCourseProgressValue(course);
            console.log(`Course ${course.id} progress: ${progressVal}%`);
            return (
              <Card
                key={course.id}
                hover
                className="cursor-pointer rounded-xl overflow-hidden"
                onClick={() =>
                  navigate(`/courses/${course.id}`, {
                    state: { from: "dashboard" },
                  })
                }
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />

                  {/* Progress bar - always shows using fallback value */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur p-3">
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${progressVal}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">
                      {progressVal}% completed
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-3 text-sm text-gray-500">
                    {course.difficultyLevel}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
