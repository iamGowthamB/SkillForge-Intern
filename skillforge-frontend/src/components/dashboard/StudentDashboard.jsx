// // src/components/dashboard/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Award,
//   TrendingUp,
//   Clock,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";

// import { courseService } from "../../services/courseService";
// import { adaptiveService } from "../../services/adaptiveService";

// import Card from "../common/Card";
// import Loader from "../common/Loader";
// import Button from "../common/Button";
// import toast from "react-hot-toast";
// import ProgressTracker from "../progress/ProgressTracker";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const { user } = useSelector((s) => s.auth);

//   const [courses, setCourses] = useState([]);
//   const [nextSuggestion, setNextSuggestion] = useState(null);
//   const [suggestedCourseId, setSuggestedCourseId] = useState(null); // <-- store course id we asked about
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       const res = await courseService.getPublishedCourses(user?.userId);
//       // defensive: the service might return data in res.data or res.data.data depending on API standardization
//       const courseList = res?.data?.data ?? res?.data ?? [];
//       setCourses(courseList || []);

//       // Fetch AI adaptive recommendation for FIRST course (optional)
//       if ((courseList?.length || 0) > 0) {
//         const firstCourse = courseList[0];
//         setSuggestedCourseId(firstCourse?.id ?? null);

//         const suggestionResp = await adaptiveService.getNextTopic(
//           user?.userId,
//           firstCourse?.id
//         );

//         // adaptiveService likely returns { data: { data: <topic> } } or { data: <topic> }
//         const topic = suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
//         setNextSuggestion(topic);
//       }
//     } catch (err) {
//       console.error("Failed to load dashboard:", err);
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader />;

//   const enrolled = courses.filter((c) => c.isEnrolled);
//   const completed = enrolled.filter((c) => c.isCompleted);
//   const inProgress = enrolled.filter((c) => !c.isCompleted);

//   const stats = [
//     {
//       label: "Enrolled",
//       value: enrolled.length,
//       icon: BookOpen,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       label: "Completed",
//       value: completed.length,
//       icon: Award,
//       color: "from-green-500 to-green-600",
//     },
//     {
//       label: "In Progress",
//       value: inProgress.length,
//       icon: TrendingUp,
//       color: "from-yellow-500 to-yellow-600",
//     },
//     {
//       label: "Available",
//       value: courses.length,
//       icon: Clock,
//       color: "from-purple-500 to-purple-600",
//     },
//   ];

//   const getCourseProgressValue = (course) => {
//     return (
//       course?.progressPercent ??
//       course?.completionPercentage ??
//       course?.progressPercentage ??
//       course?.progress?.completionPercentage ??
//       course?.enrollment?.completionPercentage ??
//       0
//     );
//   };

//   const getProgressColor = (percent) => {
//     if (percent < 30) return "#ef4444"     // red
//     if (percent < 70) return "#facc15"     // yellow
//     return "#22c55e"                       // green
//   }


//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       {/* Hero */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Ready to continue your learning journey?
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats.map((item) => {
//           const Icon = item.icon;
//           return (
//             <div
//               key={item.label}
//               className="p-6 rounded-2xl shadow bg-white border hover:shadow-lg transition"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-gray-500">{item.label}</p>
//                   <p className="text-3xl font-bold mt-1">{item.value}</p>
//                 </div>
//                 <div
//                   className={`p-4 rounded-xl bg-gradient-to-br ${item.color}`}
//                 >
//                   <Icon className="text-white" size={26} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* AI Recommendation */}
//       {nextSuggestion && (
//         <Card className="p-7 mb-10 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow">
//           <div className="flex items-center space-x-4">
//             <Sparkles size={32} className="text-blue-600" />

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Next Suggested Topic For You
//               </h2>

//               <p className="text-gray-700 mt-1 font-medium">
//                 {nextSuggestion?.name ?? "(Untitled topic)"}
//               </p>
//               <p className="text-gray-500 text-sm mt-1">
//                 {nextSuggestion?.description ?? ""}
//               </p>

//               <Button
//                 onClick={() => {
//                   // Prefer the course id that we actually asked for (safe), fallback to any courseId on topic if present
//                   const cid = suggestedCourseId ?? nextSuggestion?.courseId ?? nextSuggestion?.course?.id;
//                   if (!cid) {
//                     toast.error("Course id not available for navigation.");
//                     return;
//                   }

//                   navigate(`/courses/${cid}`, {
//                     state: {
//                       recommendedTopicId: nextSuggestion?.id,
//                       forceReload: Date.now(),
//                     },
//                   });
//                 }}
//                 className="mt-3 flex items-center gap-2"
//               >
//                 Go to Topic <ArrowRight size={16} />
//               </Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Progress Section */}
//       <ProgressTracker />

//       {/* Courses Section */}
//       <div className="flex items-center justify-between mt-10 mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
//         <Button onClick={() => navigate("/courses")} variant="outline">
//           View All
//         </Button>
//       </div>

//       {courses.length === 0 ? (
//         <Card className="p-12 text-center">
//           <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900">
//             No courses yet!
//           </h3>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.slice(0, 6).map((course) => {
//             const progressVal = getCourseProgressValue(course);

//             console.log(`Course ${course.id} progress: ${progressVal}%`);
//             return (
//               <Card
//                 key={course.id}
//                 hover
//                 className="cursor-pointer rounded-xl overflow-hidden"
//                 onClick={() =>
//                   navigate(`/courses/${course.id}`, {
//                     state: { from: "dashboard" },
//                   })
//                 }
//               >
//                 <div className="h-48 overflow-hidden relative">
//                   <img
//                     src={course.thumbnailUrl}
//                     alt={course.title}
//                     className="w-full h-full object-cover transition-transform hover:scale-105"
//                   />

//                   {/* Progress bar - always shows using fallback value */}
//                   <div className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur p-3">
//                     <div className="w-full bg-gray-300 rounded-full h-2">
//                       <div
//                         className="h-full rounded-full transition-all duration-300"
//                         style={{
//                           width: `${progressVal}%`,
//                           backgroundColor: getProgressColor(progressVal)
//                         }}
//                       ></div>

//                     </div>
//                     <p className="text-xs text-gray-700 mt-1">
//                       {progressVal}% completed
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <h3 className="font-bold text-gray-900 text-lg">
//                     {course.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//                     {course.description}
//                   </p>
//                   <div className="mt-3 text-sm text-gray-500">
//                     {course.difficultyLevel}
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


// // src/components/dashboard/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Award,
//   TrendingUp,
//   Clock,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";

// import { courseService } from "../../services/courseService";
// import { adaptiveService } from "../../services/adaptiveService";

// import Card from "../common/Card";
// import Loader from "../common/Loader";
// import Button from "../common/Button";
// import toast from "react-hot-toast";
// import ProgressTracker from "../progress/ProgressTracker";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const { user } = useSelector((s) => s.auth);

//   const [courses, setCourses] = useState([]);
//   const [nextSuggestion, setNextSuggestion] = useState(null);
//   const [suggestedCourseId, setSuggestedCourseId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//   }, [user]);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       const res = await courseService.getPublishedCourses(user?.userId);
//       const courseList = res?.data?.data ?? res?.data ?? [];
//       setCourses(courseList || []);

//       if ((courseList?.length || 0) > 0) {
//         const firstCourse = courseList[0];
//         setSuggestedCourseId(firstCourse?.id ?? null);

//         const suggestionResp = await adaptiveService.getNextTopic(
//           user?.userId,
//           firstCourse?.id
//         );

//         const topic =
//           suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
//         setNextSuggestion(topic);
//       }
//     } catch (err) {
//       console.error("Failed to load dashboard:", err);
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader />;

//   const enrolled = courses.filter((c) => c.isEnrolled);
//   const completed = enrolled.filter((c) => c.isCompleted);
//   const inProgress = enrolled.filter((c) => !c.isCompleted);

//   const stats = [
//     {
//       label: "Enrolled",
//       value: enrolled.length,
//       icon: BookOpen,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       label: "Completed",
//       value: completed.length,
//       icon: Award,
//       color: "from-green-500 to-green-600",
//     },
//     {
//       label: "In Progress",
//       value: inProgress.length,
//       icon: TrendingUp,
//       color: "from-yellow-500 to-yellow-600",
//     },
//     {
//       label: "Available",
//       value: courses.length,
//       icon: Clock,
//       color: "from-purple-500 to-purple-600",
//     },
//   ];

//   // ⭐ NEW: Consistent fallback chain
//   const getCourseProgressValue = (course) => {
//     return (
//       course?.progressPercent ??
//       course?.completionPercentage ??
//       course?.progressPercentage ??
//       course?.progress?.completionPercentage ??
//       course?.enrollment?.completionPercentage ??
//       0
//     );
//   };

//   // ⭐ NEW — Color-coded progress system
//   const getProgressColor = (percent) => {
//     if (percent < 30) return "#ef4444"; // RED
//     if (percent < 70) return "#facc15"; // YELLOW
//     return "#22c55e"; // GREEN
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">

//       {/* Hero */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Ready to continue your learning journey?
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats.map((item) => {
//           const Icon = item.icon;
//           return (
//             <div
//               key={item.label}
//               className="p-6 rounded-2xl shadow bg-white border hover:shadow-lg transition"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-gray-500">{item.label}</p>
//                   <p className="text-3xl font-bold mt-1">{item.value}</p>
//                 </div>
//                 <div
//                   className={`p-4 rounded-xl bg-gradient-to-br ${item.color}`}
//                 >
//                   <Icon className="text-white" size={26} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* AI Recommendation */}
//       {nextSuggestion && (
//         <Card className="p-7 mb-10 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow">
//           <div className="flex items-center space-x-4">
//             <Sparkles size={32} className="text-blue-600" />

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Next Suggested Topic For You
//               </h2>

//               <p className="text-gray-700 mt-1 font-medium">
//                 {nextSuggestion?.name ?? "(Untitled topic)"}
//               </p>
//               <p className="text-gray-500 text-sm mt-1">
//                 {nextSuggestion?.description ?? ""}
//               </p>

//               <Button
//                 onClick={() => {
//                   const cid =
//                     suggestedCourseId ??
//                     nextSuggestion?.courseId ??
//                     nextSuggestion?.course?.id;
//                   if (!cid) {
//                     toast.error("Course id not available for navigation.");
//                     return;
//                   }

//                   navigate(`/courses/${cid}`, {
//                     state: {
//                       recommendedTopicId: nextSuggestion?.id,
//                       forceReload: Date.now(),
//                     },
//                   });
//                 }}
//                 className="mt-3 flex items-center gap-2"
//               >
//                 Go to Topic <ArrowRight size={16} />
//               </Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Progress Section */}
//       <ProgressTracker />

//       {/* Courses Section */}
//       <div className="flex items-center justify-between mt-10 mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
//         <Button onClick={() => navigate("/courses")} variant="outline">
//           View All
//         </Button>
//       </div>

//       {/* Course Cards */}
//       {courses.length === 0 ? (
//         <Card className="p-12 text-center">
//           <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-xl font-semibold text-gray-900">
//             No courses yet!
//           </h3>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.slice(0, 6).map((course) => {
//             const progressVal = getCourseProgressValue(course);

//             return (
//               <Card
//                 key={course.id}
//                 hover
//                 className="cursor-pointer rounded-xl overflow-hidden"
//                 onClick={() =>
//                   navigate(`/courses/${course.id}`, {
//                     state: { from: "dashboard" },
//                   })
//                 }
//               >
//                 <div className="h-48 overflow-hidden relative">
//                   <img
//                     src={course.thumbnailUrl}
//                     alt={course.title}
//                     className="w-full h-full object-cover transition-transform hover:scale-105"
//                   />

//                   {/* ⭐ Color-coded Progress Bar */}
//                   <div className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur p-3">
//                     <div className="w-full bg-gray-300 rounded-full h-2">
//                       <div
//                         className="h-full rounded-full transition-all duration-300"
//                         style={{
//                           width: `${progressVal}%`,
//                           backgroundColor: getProgressColor(progressVal),
//                         }}
//                       ></div>
//                     </div>

//                     <p className="text-xs text-gray-700 mt-1">
//                       {progressVal}% completed
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <h3 className="font-bold text-gray-900 text-lg">
//                     {course.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//                     {course.description}
//                   </p>
//                   <div className="mt-3 text-sm text-gray-500">
//                     {course.difficultyLevel}
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// // src/components/dashboard/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Award,
//   TrendingUp,
//   Clock,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";

// import { courseService } from "../../services/courseService";
// import { adaptiveService } from "../../services/adaptiveService";
// import { progressService } from "../../services/progressService";

// import Card from "../common/Card";
// import Loader from "../common/Loader";
// import Button from "../common/Button";
// import toast from "react-hot-toast";
// import ProgressTracker from "../progress/ProgressTracker";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const { user } = useSelector((s) => s.auth);

//   const [courses, setCourses] = useState([]);
//   const [enrollments, setEnrollments] = useState([]); // progress + lastAccessed
//   const [nextSuggestion, setNextSuggestion] = useState(null);
//   const [suggestedCourseId, setSuggestedCourseId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [slideIndex, setSlideIndex] = useState(0);


//   useEffect(() => {
//     loadDashboard();
//   }, [user]);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       /** 1️⃣ Load published courses */
//       const res = await courseService.getPublishedCourses(user?.userId);

//       // const courseList = res?.data?.data ?? res?.data ?? [];
//       const courseList = res?.data ?? [];

//       console.log("Courses fetched from Student DashBoard:", courseList);
//       setCourses(courseList);

//       /** 2️⃣ Load progress (course-level) */
//       const progResp = await progressService.getStudentProgress(user?.studentId);
//       // const progressList = progResp?.data?.data ?? [];
//       const progressList = progResp?.data?.data ?? progResp?.data ?? [];
//       console.log("Progress fetched from Student DashBoard:", progressList);
//       setEnrollments(progressList);

//       /** 3️⃣ Load AI recommendation (optional) */
//       if (courseList.length > 0) {
//         const firstCourse = courseList[0];
//         setSuggestedCourseId(firstCourse?.id);

//         const suggestionResp = await adaptiveService.getNextTopic(
//           user?.userId,
//           firstCourse?.id
//         );

//         const topic =
//           suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
//         setNextSuggestion(topic);
//       }
//     } catch (err) {
//       console.error("Failed to load dashboard:", err);
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader />;

//   // --- Helper: Get progress value ----
//   const getProgress = (courseId) => {
//     const p = enrollments.find((e) => e.courseId === courseId);
//     return p?.completionPercentage ??
//            p?.progressPercent?? 
//            0;

//   };

//   const getLastAccessed = (courseId) => {
//     const p = enrollments.find((e) => e.courseId === courseId);
//     return p?.lastAccessed ?? null;
//   };

//   // --- Color-coded progress ---
//   const getProgressColor = (percent) => {
//     if (percent < 30) return "#ef4444"; // RED
//     if (percent < 70) return "#facc15"; // YELLOW
//     return "#22c55e"; // GREEN
//   };

//   // --- Filter enrolled ---
//   const enrolledCourses = courses.filter((c) => c.isEnrolled);

//   // --- Sort enrolled by last accessed ---
//   const sortedEnrolled = [...enrolledCourses].sort((a, b) => {
//     const A = new Date(getLastAccessed(a.id) || 0).getTime();
//     const B = new Date(getLastAccessed(b.id) || 0).getTime();
//     return B - A;
//   });

//   // --- Stats ---
//   const completed = sortedEnrolled.filter((c) => getProgress(c?.id) === 100);
//   const inProgress = sortedEnrolled.filter(
//     (c) => getProgress(c?.id) > 0 && getProgress(c?.id) < 100
//   );

//   const stats = [
//     {
//       label: "Enrolled",
//       value: sortedEnrolled.length,
//       icon: BookOpen,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       label: "Completed",
//       value: completed.length,
//       icon: Award,
//       color: "from-green-500 to-green-600",
//     },
//     {
//       label: "In Progress",
//       value: inProgress.length,
//       icon: TrendingUp,
//       color: "from-yellow-500 to-yellow-600",
//     },
//     {
//       label: "Available",
//       value: courses.length,
//       icon: Clock,
//       color: "from-purple-500 to-purple-600",
//     },
//   ];

//   // --- If no enrolled courses: Show top 6 by popularity ---
//   const popularCourses = [...courses]
//     .sort((a, b) => b.totalEnrollments - a.totalEnrollments)
//     .slice(0, 6);

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       {/* Welcome */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Ready to continue your learning journey?
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats.map((item) => {
//           const Icon = item.icon;
//           return (
//             <div
//               key={item.label}
//               className="p-6 rounded-2xl shadow bg-white border hover:shadow-lg transition"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-gray-500">{item.label}</p>
//                   <p className="text-3xl font-bold mt-1">{item.value}</p>
//                 </div>
//                 <div
//                   className={`p-4 rounded-xl bg-gradient-to-br ${item.color}`}
//                 >
//                   <Icon className="text-white" size={26} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* AI Recommendation */}
//       {nextSuggestion && (
//         <Card className="p-7 mb-10 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow">
//           <div className="flex items-center space-x-4">
//             <Sparkles size={32} className="text-blue-600" />

//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Next Suggested Topic For You
//               </h2>

//               <p className="text-gray-700 mt-1 font-medium">
//                 {nextSuggestion?.name ?? "(Untitled topic)"}
//               </p>
//               <p className="text-gray-500 text-sm mt-1">
//                 {nextSuggestion?.description ?? ""}
//               </p>

//               <Button
//                 onClick={() => {
//                   const cid =
//                     suggestedCourseId ??
//                     nextSuggestion?.courseId ??
//                     nextSuggestion?.course?.id;
//                   if (!cid) {
//                     toast.error("Course id not available.");
//                     return;
//                   }
//                   navigate(`/courses/${cid}`);
//                 }}
//                 className="mt-3 flex items-center gap-2"
//               >
//                 Go to Topic <ArrowRight size={16} />
//               </Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Progress Section */}
//       <ProgressTracker />

//     {/* Courses Section */}
// <div className="flex items-center justify-between mt-10 mb-4">
//   <h2 className="text-2xl font-bold text-gray-900">
//     {sortedEnrolled.length > 0 ? "Recently Accessed" : "Recommended For You"}
//   </h2>

//   <Button onClick={() => navigate("/courses")} variant="outline">
//     View All
//   </Button>
// </div>

// {/* ---- NETFLIX STYLE CAROUSEL ---- */}
// <div className="relative">

//   {/* Left Arrow */}
//   <button
//     onClick={() => {
//       document.getElementById("courseCarousel").scrollBy({ left: -320, behavior: "smooth" });
//     }}
//     className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg p-3 rounded-full hover:scale-110 transition hidden sm:block"
//   >
//     ◀
//   </button>

//   {/* Scroll container */}
//   <div
//     id="courseCarousel"
//     className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
//     style={{ scrollPaddingLeft: "40px" }}
//   >
//     {(sortedEnrolled.length === 0 ? popularCourses : sortedEnrolled)
//       .slice(0, 20)
//       .map((course) => {
//         const progressVal = getProgress(course.id);

//         return (
//           <Card
//             key={course.id}
//             hover
//             className="min-w-[320px] max-w-[320px] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition"
//             onClick={() =>
//               navigate(`/courses/${course.id}`, {
//                 state: { from: "dashboard" },
//               })
//             }
//           >
//             {/* Thumbnail */}
//             <div className="h-44 relative">
//               <img
//                 src={course.thumbnailUrl}
//                 alt={course.title}
//                 className="w-full h-full object-cover"
//               />

//               {/* Progress bar */}
//               {course.isEnrolled && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur p-2">
//                   <div className="w-full bg-gray-300 rounded-full h-2">
//                     <div
//                       className="h-full rounded-full transition-all duration-300"
//                       style={{
//                         width: `${progressVal}%`,
//                         backgroundColor: getProgressColor(progressVal),
//                       }}
//                     ></div>
//                   </div>
//                   <p className="text-[10px] text-white mt-1">
//                     {progressVal}% completed
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Details */}
//             <div className="p-4">
//               <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
//                 {course.title}
//               </h3>
//               <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//                 {course.description}
//               </p>
//               <p className="mt-2 text-xs font-semibold text-gray-500">
//                 {course.difficultyLevel}
//               </p>
//             </div>
//           </Card>
//         );
//       })}
//   </div>

//   {/* Right Arrow */}
//   <button
//     onClick={() => {
//       document.getElementById("courseCarousel").scrollBy({ left: 320, behavior: "smooth" });
//     }}
//     className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg p-3 rounded-full hover:scale-110 transition hidden sm:block"
//   >
//     ▶
//   </button>
// </div>

//     </div>
//   );
// }

// // src/components/dashboard/StudentDashboard.jsx
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   BookOpen,
//   Award,
//   TrendingUp,
//   Clock,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";

// import { courseService } from "../../services/courseService";
// import { adaptiveService } from "../../services/adaptiveService";
// import { progressService } from "../../services/progressService";

// import Card from "../common/Card";
// import Loader from "../common/Loader";
// import Button from "../common/Button";
// import toast from "react-hot-toast";
// import ProgressTracker from "../progress/ProgressTracker";

// export default function StudentDashboard() {
//   const navigate = useNavigate();
//   const { user } = useSelector((s) => s.auth);

//   const [courses, setCourses] = useState([]);
//   const [enrollments, setEnrollments] = useState([]); // progress + lastAccessed
//   const [nextSuggestion, setNextSuggestion] = useState(null);
//   const [suggestedCourseId, setSuggestedCourseId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // carousel refs + state
//   const carouselRef = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   // card width - adjust if you want bigger/smaller cards
//   const CARD_WIDTH = 360; // px (includes gap handling)

//   useEffect(() => {
//     loadDashboard();
//     // evaluate arrows after load / resize
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   useEffect(() => {
//     const el = carouselRef.current;
//     if (!el) return;

//     // set initial arrow visibility
//     updateArrows();

//     const onScroll = () => updateArrows();
//     const onResize = () => updateArrows();

//     el.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onResize);

//     return () => {
//       el.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onResize);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [courses, enrollments]);

//   const updateArrows = useCallback(() => {
//     const el = carouselRef.current;
//     if (!el) {
//       setCanScrollLeft(false);
//       setCanScrollRight(false);
//       return;
//     }
//     const { scrollLeft, scrollWidth, clientWidth } = el;
//     setCanScrollLeft(scrollLeft > 10);
//     setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
//   }, []);

//   const scrollBy = (dir = "right") => {
//     const el = carouselRef.current;
//     if (!el) return;
//     const distance = CARD_WIDTH; // scroll one card
//     const left = dir === "right" ? el.scrollLeft + distance : el.scrollLeft - distance;
//     el.scrollTo({ left, behavior: "smooth" });
//   };

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       /** 1️⃣ Load published courses (frontend expects res.data.data or res.data) */
//       const res = await courseService.getPublishedCourses(user?.userId);
//       const courseList = res?.data?.data ?? res?.data ?? [];
//       setCourses(courseList || []);

//       /** 2️⃣ Load progress (course-level) — use studentId which you've confirmed works */
//       const progResp = await progressService.getStudentProgress(user?.studentId);
//       const progressList = progResp?.data?.data ?? progResp?.data ?? [];
//       setEnrollments(progressList || []);

//       /** 3️⃣ Adaptive suggestion (optional) */
//       if ((courseList?.length || 0) > 0) {
//         const firstCourse = courseList[0];
//         setSuggestedCourseId(firstCourse?.id ?? null);

//         const suggestionResp = await adaptiveService.getNextTopic(
//           user?.userId,
//           firstCourse?.id
//         );
//         const topic = suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
//         setNextSuggestion(topic);
//       }
//     } catch (err) {
//       console.error("Failed to load dashboard:", err);
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//       // ensure arrows compute after mount
//       setTimeout(updateArrows, 50);
//     }
//   };

//   if (loading) return <Loader />;

//   // --- Helper: Get progress value ----
//   const getProgress = (courseId) => {
//     const p = enrollments.find((e) => Number(e.courseId) === Number(courseId));
//     return p?.completionPercentage ?? p?.progressPercent ?? 0;
//   };

//   const getLastAccessed = (courseId) => {
//     const p = enrollments.find((e) => Number(e.courseId) === Number(courseId));
//     // some endpoints use lastAccessed or lastAccessedAt or lastUpdated
//     return p?.lastAccessed ?? p?.lastAccessedAt ?? p?.lastUpdated ?? null;
//   };

//   // --- Color-coded progress ---
//   const getProgressColor = (percent) => {
//     if (percent < 30) return "#ef4444"; // RED
//     if (percent < 70) return "#facc15"; // YELLOW
//     return "#22c55e"; // GREEN
//   };

//   // --- Filter enrolled ---
//   const enrolledCourses = courses.filter((c) => c.isEnrolled);

//   // --- Sort enrolled by last accessed (most recent first) ---
//   const sortedEnrolled = [...enrolledCourses].sort((a, b) => {
//     const A = new Date(getLastAccessed(a.id) || 0).getTime();
//     const B = new Date(getLastAccessed(b.id) || 0).getTime();
//     return B - A;
//   });

//   // --- Stats ---
//   const completed = sortedEnrolled.filter((c) => getProgress(c?.id) === 100);
//   const inProgress = sortedEnrolled.filter(
//     (c) => getProgress(c?.id) > 0 && getProgress(c?.id) < 100
//   );

//   const stats = [
//     {
//       label: "Enrolled",
//       value: sortedEnrolled.length,
//       icon: BookOpen,
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       label: "Completed",
//       value: completed.length,
//       icon: Award,
//       color: "from-green-500 to-green-600",
//     },
//     {
//       label: "In Progress",
//       value: inProgress.length,
//       icon: TrendingUp,
//       color: "from-yellow-500 to-yellow-600",
//     },
//     {
//       label: "Available",
//       value: courses.length,
//       icon: Clock,
//       color: "from-purple-500 to-purple-600",
//     },
//   ];

//   // --- If no enrolled courses: Show top 6 by popularity ---
//   const popularCourses = [...courses]
//     .sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0))
//     .slice(0, 6);

//   // Which list we will show in carousel
//   const carouselItems = (sortedEnrolled.length === 0 ? popularCourses : sortedEnrolled).slice(0, 20);

//   // CSS to hide native scrollbar in a cross-browser-friendly minimal way
//   const hideScrollbarStyle = {
//     scrollbarWidth: "none", // firefox
//     msOverflowStyle: "none", // ie 10+
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       {/* Welcome */}
//       <div className="mb-10">
//         <h1 className="text-4xl font-bold text-gray-900">
//           Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
//         </h1>
//         <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {stats.map((item) => {
//           const Icon = item.icon;
//           return (
//             <div
//               key={item.label}
//               className="p-6 rounded-2xl shadow bg-white border hover:shadow-lg transition"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-gray-500">{item.label}</p>
//                   <p className="text-3xl font-bold mt-1">{item.value}</p>
//                 </div>
//                 <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color}`}>
//                   <Icon className="text-white" size={26} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* AI Recommendation */}
//       {nextSuggestion && (
//         <Card className="p-7 mb-10 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow">
//           <div className="flex items-center space-x-4">
//             <Sparkles size={32} className="text-blue-600" />
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Next Suggested Topic For You</h2>
//               <p className="text-gray-700 mt-1 font-medium">{nextSuggestion?.name ?? "(Untitled topic)"}</p>
//               <p className="text-gray-500 text-sm mt-1">{nextSuggestion?.description ?? ""}</p>

//               <Button
//                 onClick={() => {
//                   const cid = suggestedCourseId ?? nextSuggestion?.courseId ?? nextSuggestion?.course?.id;
//                   if (!cid) {
//                     toast.error("Course id not available.");
//                     return;
//                   }
//                   navigate(`/courses/${cid}`, {
//                     state: { recommendedTopicId: nextSuggestion?.id, forceReload: Date.now() },
//                   });
//                 }}
//                 className="mt-3 flex items-center gap-2"
//               >
//                 Go to Topic <ArrowRight size={16} />
//               </Button>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Progress Section */}
//       <ProgressTracker />

//       {/* Courses Section header */}
//       <div className="flex items-center justify-between mt-10 mb-4">
//         <h2 className="text-2xl font-bold text-gray-900">
//           {sortedEnrolled.length > 0 ? "Recently Accessed" : "Recommended For You"}
//         </h2>
//         <Button onClick={() => navigate("/courses")} variant="outline">
//           View All
//         </Button>
//       </div>

//       {/* Carousel + arrows wrapper */}
//       <div className="relative">
//         {/* Left arrow (outside cards) */}
//         <div
//           className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-auto`}
//           style={{ width: 72, height: 72, display: canScrollLeft ? "flex" : "none", alignItems: "center", justifyContent: "center" }}
//         >
//           <button
//             onClick={() => scrollBy("left")}
//             aria-label="Scroll left"
//             className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
//             style={{ background: "rgba(244,246,252,0.9)" }}
//           >
//             <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(30,58,138,0.08)" }}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
//             </div>
//           </button>
//         </div>

//         {/* Right arrow (outside cards) */}
//         <div
//           className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 pointer-events-auto`}
//           style={{ width: 72, height: 72, display: canScrollRight ? "flex" : "none", alignItems: "center", justifyContent: "center" }}
//         >
//           <button
//             onClick={() => scrollBy("right")}
//             aria-label="Scroll right"
//             className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
//             style={{ background: "rgba(244,246,252,0.9)" }}
//           >
//             <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(30,58,138,0.08)" }}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
//             </div>
//           </button>
//         </div>

//         {/* Horizontal scroll container */}
//         <div
//           ref={carouselRef}
//           id="courseCarousel"
//           className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
//           style={{
//             paddingLeft: 24,
//             paddingRight: 24,
//             ...hideScrollbarStyle,
//           }}
//         >
//           {/* hide scrollbar cross-browser - additional inline style for webkit */}
//           <style>{`
//             #courseCarousel::-webkit-scrollbar { display: none; height: 0; }
//           `}</style>

//           {carouselItems.map((course) => {
//             const progressVal = getProgress(course.id);
//             return (
//               <Card
//                 key={course.id}
//                 hover
//                 className="min-w-[30rem] max-w-[30rem] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition"
//                 onClick={() =>
//                   navigate(`/courses/${course.id}`, {
//                     state: { from: "dashboard" },
//                   })
//                 }
//               >
//                 <div className="h-44 relative">
//                   <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />

//                   {/* Progress — only show for enrolled */}
//                   {course.isEnrolled && (
//                     <div className="absolute bottom-2 left-3 right-3 bg-black/40 backdrop-blur px-3 py-2 rounded-md">
//                       <div className="w-full bg-gray-300 rounded-full h-2">
//                         <div
//                           className="h-full rounded-full transition-all duration-300"
//                           style={{ width: `${progressVal}%`, backgroundColor: getProgressColor(progressVal) }}
//                         />
//                       </div>
//                       <p className="text-[11px] text-white mt-1">{progressVal}% completed</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{course.title}</h3>
//                   <p className="text-gray-600 text-sm mt-2 line-clamp-2">{course.description}</p>
//                   <div className="mt-3 flex items-center justify-between">
//                     <p className="text-xs font-semibold text-gray-500">{course.difficultyLevel}</p>
//                     <p className="text-xs text-gray-400">{course.totalTopics ?? 0} topics</p>
//                   </div>
//                 </div>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/dashboard/StudentDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
} from "lucide-react";

import { courseService } from "../../services/courseService";
import { adaptiveService } from "../../services/adaptiveService";
import { progressService } from "../../services/progressService";
import { enrollmentService } from "../../services/enrollmentService";

import Card from "../common/Card";
import Loader from "../common/Loader";
import Button from "../common/Button";
import DashboardOverview from "./DashboardOverview";
import toast from "react-hot-toast";
import ProgressTracker from "../progress/ProgressTracker";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]); // progress + lastAccessed
  const [nextSuggestion, setNextSuggestion] = useState(null);
  const [suggestedCourseId, setSuggestedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carousel refs + state (declared early so helpers can use them)
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // layout constants
  const CARD_WIDTH = 360; // px (including any margins/gap)
  const VISIBLE_COUNT = 3; // how many cards visible at once
  const GAP = 24; // px gap between cards

  // ----------------- Helper functions (declared BEFORE useEffect to avoid ref errors) -----------------
  const getProgress = (courseId) => {
    const p = enrollments.find((e) => e.courseId === courseId);
    return p?.completionPercentage ?? p?.progressPercent ?? 0;
  };

  const getLastAccessed = (courseId) => {
    const p = enrollments.find((e) => e.courseId === courseId);
    return p?.lastAccessed ?? p?.lastAccessedAt ?? p?.lastUpdated ?? null;
  };

  const getProgressColor = (percent) => {
    if (percent < 30) return "#ef4444";
    if (percent < 70) return "#facc15";
    return "#22c55e";
  };

  const handleEnroll = async (e, courseId, courseTitle) => {
    e.stopPropagation();
    try {
      await enrollmentService.enrollCourse(user.userId, courseId);
      toast.success(`Enrolled in ${courseTitle}!`);
      loadDashboard(); // Reload to show updated enrollment
    } catch (error) {
      console.error('Enrollment failed:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const handleUnenroll = async (e, courseId, courseTitle) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
      try {
        await enrollmentService.unenrollCourse(user.userId, courseId);
        toast.success('Unenrolled successfully!');
        loadDashboard(); // Reload to show updated enrollment
      } catch (error) {
        console.error('Unenroll failed:', error);
        toast.error('Failed to unenroll');
      }
    }
  };

  const getCollection = () => (sortedEnrolled.length === 0 ? popularCourses : sortedEnrolled);

  // update arrows visibility and slideIndex based on scroll position
  const updateArrows = () => {
    const el = carouselRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < Math.max(0, maxScrollLeft - 10));
    // compute slideIndex as nearest item index at left (approx)
    const idx = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
    setSlideIndex(Math.max(0, idx));
  };

  const scrollByCards = (count) => {
    const el = carouselRef.current;
    if (!el) return;
    const step = (CARD_WIDTH + GAP) * count;
    el.scrollBy({ left: step, behavior: "smooth" });
    // schedule update after animation
    setTimeout(updateArrows, 310);
  };

  const handleScroll = () => {
    updateArrows();
  };

  // ----------------- Data loader (declared before useEffect) -----------------
  // const loadDashboard = async () => {
  //   try {
  //     setLoading(true);

  //     // 1) Published courses — defensive parsing for various API shapes
  //     const res = await courseService.getPublishedCourses(user?.userId);
  //     const courseList = res?.data?.data ?? res?.data ?? [];
  //     setCourses(Array.isArray(courseList) ? courseList : []);

  //     // 2) Progress (use user.studentId as your working key)
  //     const progResp = await progressService.getStudentProgress(user?.studentId);
  //     const progressList = progResp?.data?.data ?? progResp?.data ?? [];
  //     setEnrollments(Array.isArray(progressList) ? progressList : []);

  //     // 3) AI suggestion (optional)
  //     if ((courseList?.length || 0) > 0) {
  //       const firstCourse = courseList[0];
  //       setSuggestedCourseId(firstCourse?.id ?? null);

  //       const suggestionResp = await adaptiveService.getNextTopic(
  //         user?.userId,
  //         firstCourse?.id
  //       );
  //       const topic = suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
  //       setNextSuggestion(topic);
  //     }

  //     // small delay then compute arrows (DOM should be ready)
  //     setTimeout(updateArrows, 60);
  //   } catch (err) {
  //     console.error("Failed to load dashboard:", err);
  //     toast.error("Failed to load dashboard");
  //     setCourses([]);
  //     setEnrollments([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
   // ----------------- Data loader (declared before useEffect) -----------------
const loadDashboard = async () => {
  try {
    setLoading(true);

    // 1) Fetch all published courses
    const res = await courseService.getPublishedCourses(user?.userId);
    const courseList = res?.data?.data ?? res?.data ?? [];
    setCourses(Array.isArray(courseList) ? courseList : []);

    // 2) Fetch student progress (contains lastAccessed)
    let progressList = [];
    if (user?.studentId) {
      const progResp = await progressService.getStudentProgress(user.studentId);
      progressList = progResp?.data?.data ?? progResp?.data ?? [];
      setEnrollments(Array.isArray(progressList) ? progressList : []);
    } else {
      console.error('No studentId found for user:', user);
      setEnrollments([]);
    }

    // 3) AI Suggested Topic — using MOST RECENTLY ACCESSED COURSE
    const enrolledCourses = courseList.filter((c) => c.isEnrolled);

    if (enrolledCourses.length > 0 && progressList.length > 0) {
      
      // sort progress by lastAccessed DESC
      const sortedProgress = [...progressList].sort((a, b) => {
        const dateA = new Date(a.lastAccessed || 0).getTime();
        const dateB = new Date(b.lastAccessed || 0).getTime();
        return dateB - dateA;
      });

      // pick the most recently accessed courseId
      const recentCourseId = sortedProgress[0]?.courseId;

      if (recentCourseId) {
        setSuggestedCourseId(recentCourseId);

        // call adaptive API
        try {
          const suggestionResp = await adaptiveService.getNextTopic(
            user?.userId,
            recentCourseId
          );

          const topic = suggestionResp?.data?.data ?? suggestionResp?.data ?? null;
          setNextSuggestion(topic);
        } catch (adaptiveErr) {
          console.error("Failed to load adaptive suggestion:", adaptiveErr);
          // Don't show error to user - AI suggestion is optional
        }
      }
    }

    // update arrows
    setTimeout(updateArrows, 60);

  } catch (err) {
    console.error("Failed to load dashboard:", err);
    toast.error("Failed to load dashboard");
    setCourses([]);
    setEnrollments([]);
  } finally {
    setLoading(false);
  }
};

  // ----------------- Effects -----------------
  useEffect(() => {
    loadDashboard();
    // attach resize listener to update arrows when viewport changes
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    // after courses/enrollments change, recalc arrows
    setTimeout(updateArrows, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, enrollments]);

  if (loading) return <Loader />;

  // --- Filter enrolled + sort by last accessed (most recent first)
  const enrolledCourses = courses.filter((c) => !!c.isEnrolled);

  const sortedEnrolled = [...enrolledCourses].sort((a, b) => {
    const A = new Date(getLastAccessed(a.id) || 0).getTime();
    const B = new Date(getLastAccessed(b.id) || 0).getTime();
    return B - A;
  });

  // Stats
  const completed = sortedEnrolled.filter((c) => getProgress(c?.id) === 100);
  const inProgress = sortedEnrolled.filter(
    (c) => getProgress(c?.id) > 0 && getProgress(c?.id) < 100
  );

  const stats = [
    { label: "Enrolled", value: sortedEnrolled.length, icon: BookOpen, color: "from-blue-500 to-blue-600" },
    { label: "Completed", value: completed.length, icon: Award, color: "from-green-500 to-green-600" },
    { label: "In Progress", value: inProgress.length, icon: TrendingUp, color: "from-yellow-500 to-yellow-600" },
    { label: "Available", value: courses.length, icon: Clock, color: "from-purple-500 to-purple-600" },
  ];

  const popularCourses = [...courses]
    .sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0))
    .slice(0, 6);

  // center card index: first visible index + middle offset
  const centerIndex = slideIndex + Math.floor(VISIBLE_COUNT / 2);

  // arrow visuals
  const arrowBtnBase =
    "absolute top-1/2 -translate-y-1/2 z-30 p-3 rounded-full shadow-lg flex items-center justify-center";

  //  const arrowCircleStyle =
  // "w-12 h-12 bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-white/40 flex items-center justify-center rounded-full";
  const arrowCircleStyle =
    "w-12 h-12 bg-white shadow-lg ring-1 ring-black/10 flex items-center justify-center rounded-full";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-600 mt-1">Ready to continue your learning journey?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-6 rounded-2xl shadow bg-white border hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">{item.label}</p>
                  <p className="text-3xl font-bold mt-1">{item.value}</p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color}`}>
                  <Icon className="text-white" size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation */}
{nextSuggestion && (
  <div className="bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-[2px] rounded-2xl shadow-xl mb-10">
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8">
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="bg-indigo-100 text-indigo-600 p-4 rounded-xl">
          <Sparkles size={32} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Next Suggested Topic For You
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Based on your learning pattern & progress
          </p>
        </div>
      </div>

      {/* Topic Details Box */}
      <div className="mt-4 bg-white/60 backdrop-blur-md border border-white/40 shadow-md rounded-xl p-6">

        <h3 className="text-xl font-semibold text-gray-900">
          {nextSuggestion?.name}
        </h3>

        <p className="text-gray-600 mt-2 text-sm">
          {nextSuggestion?.description || "No description available."}
        </p>

        <div className="mt-5">
          <button
            onClick={() => {
              const cid =
                suggestedCourseId ??
                nextSuggestion?.courseId ??
                nextSuggestion?.course?.id;

              if (!cid) {
                toast.error("Course ID not available.");
                return;
              }

              navigate(`/courses/${cid}`, {
                state: {
                  recommendedTopicId: nextSuggestion?.id,
                  forceReload: Date.now(),
                },
              });
            }}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow text-sm font-medium flex items-center space-x-2"
          >
            <span>Go to Topic</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Comprehensive Dashboard Overview - Performance across all activities */}
      <div className="mb-10">
        <DashboardOverview />
      </div>

      {/* Progress Section */}
     <ProgressTracker />

      {/* Courses Section header */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {sortedEnrolled.length > 0 ? "Recently Accessed" : "Recommended For You"}
        </h2>

        <Button onClick={() => navigate("/courses")} variant="outline">
          View All
        </Button>
      </div>

      {/* ---- NETFLIX STYLE CAROUSEL (3 visible cards) ---- */}
      <div className="relative">
        {/* Left arrow - shows only when we can scroll left */}
        {canScrollLeft && (
          <button
            aria-label="Scroll left"
            onClick={() => scrollByCards(-1)}
            className={`${arrowBtnBase} left-0 -ml-10 hidden md:flex`}
            style={{ transform: "translateY(-50%)" }}
          >
            <div className={`${arrowCircleStyle}`}>
              <ChevronLeft size={20} className="text-blue-600" />
            </div>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={carouselRef}
          id="courseCarousel"
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          {/* hide scrollbar for webkit browsers */}
          <style>{`
            #courseCarousel::-webkit-scrollbar { display: none; height: 8px; }
          `}</style>

          {(sortedEnrolled.length === 0 ? popularCourses : sortedEnrolled)
            .slice(0, 20)
            .map((course, idx) => {
              const progressVal = getProgress(course.id);
              const overallIndex = idx;
              const isCenter = overallIndex === centerIndex;
              const scale = isCenter ? 1.03 : 1.0;

              return (

                <div
                  key={course.id}
                  className="relative"
                  style={{
                    minWidth: `${CARD_WIDTH}px`,
                    maxWidth: `${CARD_WIDTH}px`,
                    perspective: "800px",      // enables smooth 3D lifting effect
                  }}
                >
                  <Card
                    className="
      rounded-xl overflow-hidden cursor-pointer shadow-md 
      transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
      hover:-translate-y-3 
      hover:shadow-2xl 
      hover:ring-2 hover:ring-blue-300/40
      hover:[transform:translateZ(40px) scale(1.03)]
      bg-white
      h-full flex flex-col
    "
                    onClick={() =>
                      navigate(`/courses/${course.id}`, { state: { from: 'dashboard' } })
                    }
                  >

                    {/* Thumbnail */}
                    <div className="h-44 relative flex-shrink-0">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                          <BookOpen size={48} className="text-white opacity-80" />
                        </div>
                      )}

                      {/* Progress bar */}
                      {course.isEnrolled && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur p-2">
                          <div className="w-full bg-gray-300 rounded-full h-2">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${progressVal}%`,
                                backgroundColor: getProgressColor(progressVal),
                              }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-white mt-1">{progressVal}% completed</p>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-semibold text-gray-500">
                          {course.difficultyLevel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.totalTopics || 0} topics
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-2 mt-4">
                        {course.isEnrolled ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/courses/${course.id}`, { state: { from: 'dashboard' } });
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                              <Play size={16} /> Continue
                            </button>
                            <button
                              onClick={(e) => handleUnenroll(e, course.id, course.title)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                            >
                              <X size={16} /> Unenroll
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handleEnroll(e, course.id, course.title)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Enroll Now
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>


              );
            })}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            aria-label="Scroll right"
            onClick={() => scrollByCards(1)}
            className={`${arrowBtnBase} right-0 -mr-10 hidden md:flex`}
            style={{ transform: "translateY(-50%)" }}
          >
            <div className={`${arrowCircleStyle}`}>
              <ChevronRight size={20} className="text-blue-600" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
