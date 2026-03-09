import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft, Upload, Video, Calendar, Clock, Eye,
  Link2, CheckCircle2, AlertCircle, X,
} from "lucide-react";
import { courses } from "../data/mockData";

function getYoutubeVideoId(url: string): string | null {
  if (!url.trim()) return null;
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

type UploadMode = "youtube" | "file";

export function AddActivity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseIdFromUrl = searchParams.get("courseId") || "";

  const [uploadMode, setUploadMode] = useState<UploadMode>("youtube");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: courseIdFromUrl,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    videoFile: null as File | null,
    youtubeUrl: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const publishedCourses = courses.filter((c) => c.status === "published");
  const selectedCourse = publishedCourses.find((c) => c.id === formData.courseId);

  const youtubeId = getYoutubeVideoId(formData.youtubeUrl);
  const isValidYoutube = uploadMode === "youtube" && formData.youtubeUrl.length > 0 && !!youtubeId;
  const isInvalidYoutube = uploadMode === "youtube" && formData.youtubeUrl.length > 8 && !youtubeId;
  const previewEmbedUrl = isValidYoutube ? `https://www.youtube.com/embed/${youtubeId}` : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((p) => ({ ...p, videoFile: file }));
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) setFormData((p) => ({ ...p, videoFile: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate(formData.courseId ? `/courses/${formData.courseId}/activities` : "/courses");
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Activity Published!</h2>
        <p className="text-sm text-gray-400">Redirecting to course activities…</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-screen-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#004080] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add Activity</h1>
        <p className="text-sm text-gray-400 mt-1">Add video lectures and learning materials to your courses</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Video Details */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                <Video className="w-4 h-4 text-[#004080]" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Video Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Introduction to Neural Networks"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Brief description of the video content and learning objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value.slice(0, 500) }))}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">{formData.description.length} / 500 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData((p) => ({ ...p, courseId: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
                  required
                >
                  <option value="">Choose a course...</option>
                  {publishedCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Upload Video */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                <Upload className="w-4 h-4 text-[#004080]" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Upload Video</h2>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-5">
              {(["youtube", "file"] as UploadMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setUploadMode(mode)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    uploadMode === mode
                      ? "bg-white text-[#004080] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {mode === "youtube" ? "YouTube URL" : "Upload File"}
                </button>
              ))}
            </div>

            {uploadMode === "youtube" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  YouTube Video URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, youtubeUrl: e.target.value }))}
                    className={`w-full pl-9 pr-10 py-2.5 text-sm bg-white border rounded-lg outline-none transition-all ${
                      isInvalidYoutube
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : isValidYoutube
                        ? "border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                        : "border-gray-200 focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10"
                    }`}
                  />
                  {isValidYoutube && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                  {isInvalidYoutube && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />}
                </div>
                {isInvalidYoutube && (
                  <p className="text-xs text-red-500 mt-1.5">Please enter a valid YouTube URL</p>
                )}
                {isValidYoutube && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid YouTube URL — preview updated on the right
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1.5">Paste any youtube.com/watch?v=... or youtu.be/... link</p>
              </div>
            )}

            {uploadMode === "file" && (
              <div>
                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                    isDragging ? "border-[#004080] bg-[#004080]/5" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-0.5">Drop your video file here, or browse</p>
                      <p className="text-xs text-gray-400">Supports MP4, AVI, MOV, WebM (Max 2GB)</p>
                    </div>
                    <label
                      htmlFor="video-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#004080] bg-[#004080]/5 border border-[#004080]/20 rounded-lg hover:bg-[#004080]/10 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Browse Files
                    </label>
                    <input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>
                {formData.videoFile && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Video className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-900 truncate">{formData.videoFile.name}</p>
                      <p className="text-xs text-emerald-600">{(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={() => setFormData((p) => ({ ...p, videoFile: null }))} className="text-emerald-500 hover:text-emerald-700 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Availability Schedule */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#004080]" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Availability Schedule</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))} className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="time" value={formData.startTime} onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))} className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))} className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="time" value={formData.endTime} onChange={(e) => setFormData((p) => ({ ...p, endTime: e.target.value }))} className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all" required />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Note:</span> Students will only be able to access this video between the specified start and end date/time.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end pb-6">
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Save as Draft</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-[#004080] rounded-lg hover:bg-[#003060] transition-colors">Publish Video</button>
          </div>
        </div>

        {/* ── Right: Preview (1/3) ── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#004080]" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Preview</h2>
            </div>

            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
              {previewEmbedUrl ? (
                <iframe src={previewEmbedUrl} title="Video Preview" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : formData.videoFile ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Video className="w-10 h-10 text-gray-300" />
                  <p className="text-xs font-medium text-gray-500">Video ready</p>
                  <p className="text-xs text-gray-400 truncate max-w-[80%]">{formData.videoFile.name}</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Video className="w-10 h-10 text-gray-300" />
                  <p className="text-xs text-gray-400">No video selected</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {selectedCourse && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Course</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCourse.name}</p>
                </div>
              )}
              {formData.title && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Title</p>
                  <p className="text-sm font-medium text-gray-800">{formData.title}</p>
                </div>
              )}
              {formData.description && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Description</p>
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{formData.description}</p>
                </div>
              )}
              {(formData.startDate || formData.endDate) && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Availability</p>
                  <div className="space-y-1">
                    {formData.startDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>Start: {formData.startDate}{formData.startTime && ` at ${formData.startTime}`}</span>
                      </div>
                    )}
                    {formData.endDate && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>End: {formData.endDate}{formData.endTime && ` at ${formData.endTime}`}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}