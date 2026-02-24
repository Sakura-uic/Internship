import { useState } from 'react'
import { Plus, BookOpen, Users, Clock, Eye, EyeOff } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { NewCourseModal } from '@/components/dashboard/NewCourseModal'
import { cn } from '@/utils/cn'

function CourseCard({ course }: { course: ReturnType<typeof useAppContext>['courses'][0] }) {
  const { updateCourseStatus, addToast } = useAppContext()
  const [toggling, setToggling] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await new Promise((r) => setTimeout(r, 400))
    const next = course.status === 'published' ? 'draft' : 'published'
    updateCourseStatus(course.id, next)
    addToast(
      `"${course.code}" ${next === 'published' ? 'published — now visible to students' : 'moved to drafts'}`,
      next === 'published' ? 'success' : 'info'
    )
    setToggling(false)
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden animate-slide-up flex flex-col">
      {/* Color strip */}
      <div className={`h-1.5 w-full ${course.status === 'published' ? 'bg-[#004080]' : 'bg-gray-200'}`} />

      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">{course.code}</p>
            <h3 className="text-sm font-semibold text-gray-900 mt-0.5 leading-snug">{course.name}</h3>
          </div>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0',
              course.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', course.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400')} />
            {course.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>

        {course.status === 'published' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Completion Rate</span>
              <span className="font-semibold text-gray-700">{course.completionRate}%</span>
            </div>
            <ProgressBar value={course.completionRate} size="md" />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5" />
                {course.students} students
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {course.lastActivity}
              </div>
            </div>

            {course.pendingSubmissions > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                  {course.pendingSubmissions} submissions pending
                </span>
              </div>
            )}
          </div>
        )}

        {course.status === 'draft' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Draft — not yet visible to students</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex gap-2 items-center">
        <button className="flex-1 text-xs font-medium text-[#004080] hover:underline text-center">
          View Course
        </button>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors',
            toggling ? 'text-gray-300' :
            course.status === 'published'
              ? 'text-amber-600 hover:text-amber-700'
              : 'text-emerald-600 hover:text-emerald-700'
          )}
          title={course.status === 'published' ? 'Move to draft' : 'Publish course'}
        >
          {toggling ? (
            <span className="w-3 h-3 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          ) : course.status === 'published' ? (
            <><EyeOff className="w-3 h-3" /> Unpublish</>
          ) : (
            <><Eye className="w-3 h-3" /> Publish</>
          )}
        </button>
      </div>
    </div>
  )
}

export function Courses() {
  const { courses } = useAppContext()
  const [showModal, setShowModal] = useState(false)

  const published = courses.filter((c) => c.status === 'published')
  const drafts = courses.filter((c) => c.status === 'draft')

  return (
    <>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-sm text-gray-500 mt-1">Spring 2026 — {published.length} published, {drafts.length} drafts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#004080] text-white text-sm font-medium rounded-lg hover:bg-[#005299] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </div>

        {published.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Published</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {published.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        )}

        {drafts.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Drafts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {drafts.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        )}

        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">No courses yet</h3>
            <p className="text-sm text-gray-400 mb-4">Create your first course to get started.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#004080] text-white text-sm font-medium rounded-lg hover:bg-[#005299] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Course
            </button>
          </div>
        )}
      </div>

      {showModal && <NewCourseModal onClose={() => setShowModal(false)} />}
    </>
  )
}