import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, Play, Clock, Eye, Calendar } from "lucide-react";
import { courses } from "../data/mockData";
import { getActivitiesByCourseId } from "../data/activitiesData";
import { ActivityItem } from "../components/courses/ActivityItem";

export function CourseActivities() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const course = courses.find((c) => c.id === courseId);
  const activities = courseId ? getActivitiesByCourseId(courseId) : [];

  const handleAddActivity = () => {
    navigate(`/add-activity?courseId=${courseId}`);
  };

  if (!course) {
    return (
      <div
        className="px-6 py-6 max-w-screen-2xl mx-auto"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="text-center py-12">
          <h2 className="text-gray-900 font-semibold mb-2">Course not found</h2>
          <button
            onClick={() => navigate("/courses")}
            className="text-sm font-medium text-[#004080] hover:underline"
          >
            Return to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="px-6 py-6 max-w-screen-2xl mx-auto"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Back + Breadcrumb */}
      <button
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#004080] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </button>

      {/* Course title header */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#004080] mb-1">{course.code}</p>
        <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
      </div>

      {/* Sub-header: count + Add Activity */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <p className="text-sm text-gray-400">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"} ·{" "}
          {course.students} students enrolled
        </p>
        <button
          onClick={handleAddActivity}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#004080] text-white text-sm font-semibold rounded-xl hover:bg-[#003060] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      {/* Activities list or empty state */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-[#004080]/8 flex items-center justify-center mb-4">
            <Play className="w-8 h-8 text-[#004080]/30" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            No activities yet
          </h3>
          <p className="text-sm text-gray-400 mb-6 text-center max-w-xs">
            Add your first video lecture or learning material to this course.
          </p>
          <button
            onClick={handleAddActivity}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#004080] text-white text-sm font-semibold rounded-xl hover:bg-[#003060] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              id={activity.id}
              title={activity.title}
              description={activity.description}
              type={activity.type}
              duration={activity.duration}
              views={activity.views}
              endDate={activity.endDate}
              status={activity.status}
              index={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}