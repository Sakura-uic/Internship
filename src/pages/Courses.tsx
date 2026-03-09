import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router";
import { courses } from "../data/mockData";
import { CourseCard } from "../components/courses/CourseCard";

export function Courses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-6 max-w-screen-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-400 mt-1">Manage and monitor all your courses</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-white bg-[#004080] rounded-xl px-4 py-2.5 hover:bg-[#003060] transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            onClick={() => navigate(`/courses/${course.id}/activities`)}
          />
        ))}
      </div>
    </div>
  );
}