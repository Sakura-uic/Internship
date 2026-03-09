import { Users, Clock, ChevronRight, BookOpen } from "lucide-react";

// Uses the course shape from your existing src/data/mockData.ts
interface CourseCardProps {
  id: string;
  code: string;
  name: string;
  students: number;
  status: "published" | "draft";
  lastActivity: string;
  completionRate: number;
  pendingSubmissions: number;
  onClick: () => void;
}

export function CourseCard({
  code,
  name,
  students,
  status,
  lastActivity,
  completionRate,
  pendingSubmissions,
  onClick,
}: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Top accent */}
      <div className={`h-1 w-full ${status === "published" ? "bg-[#004080]" : "bg-gray-200"}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-400 mb-0.5">{code}</p>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug">{name}</h3>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0 ${
              status === "published"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                status === "published" ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {status === "published" ? "Published" : "Draft"}
          </span>
        </div>

        {status === "published" ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>Completion Rate</span>
                <span className="font-semibold text-gray-700">{completionRate}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#004080] rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5" />
                {students} students
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {lastActivity}
              </div>
            </div>
            {pendingSubmissions > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                  {pendingSubmissions} submissions pending
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <BookOpen className="w-3.5 h-3.5 text-gray-300" />
            <p className="text-xs text-gray-400">Draft — not yet visible to students</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <span className="text-xs font-medium text-[#004080]">View Activities</span>
        <ChevronRight className="w-4 h-4 text-[#004080] group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}