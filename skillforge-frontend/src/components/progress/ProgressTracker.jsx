// src/components/progress/ProgressTracker.jsx
import React, { useEffect, useState } from "react";
import { progressService } from "../../services/progressService";
import { useSelector } from "react-redux";
import Card from "../common/Card";
import Loader from "../common/Loader";

const ProgressTracker = () => {
  const { user } = useSelector((state) => state.auth);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await progressService.getStudentProgress(user.userId);

      const data = res?.data?.data ?? res?.data ?? [];
      setProgress(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Progress error:", err);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>

      {progress.length === 0 ? (
        <p className="text-gray-600">No progress yet.</p>
      ) : (
        progress.map((item) => {
          // defensive fallback for property names
          const pct =
            item?.progressPercent ??
            item?.completionPercentage ??
            item?.progressPercentage ??
            item?.completionPercent ??
            0;


          return (
            <div key={item.courseId || item.courseId} className="mb-3">
              <p className="font-semibold">{item.courseName ?? item.courseTitle}</p>
              <div className="w-full h-3 bg-gray-200 rounded">
                <div
                  className="h-3 bg-blue-500 rounded"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{pct}% completed</p>
            </div>
          );
        })
      )}
    </Card>
  );
};

export default ProgressTracker;
