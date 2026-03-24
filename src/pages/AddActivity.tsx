import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Upload,
  Video,
  Calendar,
  Clock,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  Plus,
  Volume2,
  VolumeX,
  Maximize,
  X,
  CheckCircle2,
  AlertCircle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { courses } from "../data/mockData";
import { getActivitiesByCourseId } from "../data/activitiesData";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ── types ─────────────────────────────────────────────────────────────────────

interface UploadedVideo {
  id: string;
  title: string;
  description: string;
  courseId: string;
  fileUrl: string; // blob URL for local files
  thumbnail: string; // generated or placeholder
  duration: string;
  rawDuration: number; // seconds
  fileSize: string;
  uploadDate: string;
  views: number;
  status: "published" | "draft";
  isLocal: true;
}

// ── VideoPlayer component ─────────────────────────────────────────────────────

interface PlayerSource {
  type: "local" | "youtube";
  url: string;
  title: string;
}

function VideoPlayer({
  source,
  onClose,
}: {
  source: PlayerSource | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [source?.url]);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
    resetControlsTimer();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
    resetControlsTimer();
  };

  const skip = (secs: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, v.currentTime + secs));
    resetControlsTimer();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    if (v) v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (v?.requestFullscreen) v.requestFullscreen();
  };

  if (!source) {
    return (
      <div className="aspect-video w-full flex flex-col items-center justify-center gap-3 bg-gray-50 rounded-xl">
        <div className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
          <Play className="w-6 h-6 text-gray-400 ml-0.5" />
        </div>
        <p className="text-sm text-gray-400">Select a video from below to play</p>
      </div>
    );
  }

  if (source.type === "youtube") {
    const vid = getYoutubeId(source.url);
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
        <iframe
          src={`https://www.youtube.com/embed/${vid}?autoplay=1`}
          title={source.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Local video player
  return (
    <div
      className="aspect-video w-full rounded-xl overflow-hidden bg-black relative group"
      onMouseMove={resetControlsTimer}
      onMouseEnter={resetControlsTimer}
    >
      <video
        ref={videoRef}
        src={source.url}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-6 bg-gradient-to-b from-black/70 to-transparent">
          <p className="text-sm font-medium text-white truncate max-w-[70%]">{source.title}</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!playing && (
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="px-4 pb-3 pt-6 bg-gradient-to-t from-black/70 to-transparent">
          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={seek}
            className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer group/bar relative"
          >
            <div
              className="h-full bg-white rounded-full relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Skip back */}
              <button onClick={() => skip(-10)} className="text-white/80 hover:text-white transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              {/* Skip forward */}
              <button onClick={() => skip(10)} className="text-white/80 hover:text-white transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
              {/* Time */}
              <span className="text-xs text-white/80 font-medium tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Volume */}
              <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-white cursor-pointer"
              />
              {/* Fullscreen */}
              <button onClick={fullscreen} className="text-white/80 hover:text-white transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function AddActivity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseIdFromUrl = searchParams.get("courseId") || "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: courseIdFromUrl,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    videoFile: null as File | null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // local uploaded videos (in-session)
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  // player
  const [playerSource, setPlayerSource] = useState<PlayerSource | null>(null);

  const publishedCourses = courses.filter((c) => c.status === "published");
  const selectedCourse = publishedCourses.find((c) => c.id === formData.courseId);

  // existing DB activities for selected course
  const dbActivities = formData.courseId ? getActivitiesByCourseId(formData.courseId) : [];

  // combined list: newly uploaded + existing
  const allVideos = [...uploadedVideos, ...dbActivities.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    courseId: a.courseId,
    fileUrl: a.youtubeUrl || "",
    thumbnail: a.youtubeUrl && getYoutubeId(a.youtubeUrl)
      ? `https://img.youtube.com/vi/${getYoutubeId(a.youtubeUrl)}/mqdefault.jpg`
      : "",
    duration: a.duration || "",
    rawDuration: 0,
    fileSize: "",
    uploadDate: a.startDate || "",
    views: a.views || 0,
    status: a.status as "published" | "draft",
    isLocal: false as const,
  }))];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      setUploadError("Please upload a valid video file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setUploadError("File size must be under 2GB.");
      return;
    }
    setUploadError("");
    setFormData((p) => ({ ...p, videoFile: file }));
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // generate blob URL for playback
          const url = URL.createObjectURL(file);
          // generate thumbnail via video element
          const video = document.createElement("video");
          video.src = url;
          video.currentTime = 2;
          video.muted = true;
          video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = 320;
            canvas.height = 180;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, 320, 180);
            const thumb = canvas.toDataURL("image/jpeg", 0.8);
            const dur = video.duration;
            setFormData((p) => {
              // auto-fill title from filename if empty
              const autoTitle = p.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
              return { ...p, title: autoTitle };
            });
            // store as new video ready to be saved on submit
            const newVid: UploadedVideo = {
              id: `local-${Date.now()}`,
              title: formData.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
              description: formData.description,
              courseId: formData.courseId,
              fileUrl: url,
              thumbnail: thumb,
              duration: formatTime(dur),
              rawDuration: dur,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split("T")[0],
              views: 0,
              status: "draft",
              isLocal: true,
            };
            setUploadedVideos((prev) => [newVid, ...prev]);
          });
          video.load();
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 180);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to server
    navigate(formData.courseId ? `/courses/${formData.courseId}/activities` : "/courses");
  };

  const playVideo = (video: typeof allVideos[0]) => {
    if (!video.fileUrl) return;
    const isYoutube = !!getYoutubeId(video.fileUrl);
    setPlayerSource({
      type: isYoutube ? "youtube" : "local",
      url: video.fileUrl,
      title: video.title,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteUploadedVideo = (id: string) => {
    setUploadedVideos((prev) => {
      const vid = prev.find((v) => v.id === id);
      if (vid) URL.revokeObjectURL(vid.fileUrl);
      return prev.filter((v) => v.id !== id);
    });
    if (playerSource?.url && uploadedVideos.find((v) => v.id === id)?.fileUrl === playerSource.url) {
      setPlayerSource(null);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

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
        <h1 className="text-2xl font-bold text-gray-900">Video Activities</h1>
        <p className="text-sm text-gray-400 mt-1">
          Upload and manage video content for your courses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ══ LEFT COLUMN ═══════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-5">

          {/* ── Video Player ── */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <VideoPlayer source={playerSource} onClose={() => setPlayerSource(null)} />
            {playerSource && (
              <div className="px-4 py-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">Now playing</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{playerSource.title}</p>
              </div>
            )}
          </div>

          {/* ── Video List ── */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                Uploaded Videos ({allVideos.length})
              </h2>
              {selectedCourse && (
                <span className="text-xs font-medium text-[#004080] bg-[#004080]/8 px-2.5 py-1 rounded-full">
                  {selectedCourse.code}
                </span>
              )}
            </div>

            {allVideos.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">No videos yet</p>
                <p className="text-xs text-gray-400">Upload your first video using the panel on the right</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allVideos.map((video) => {
                  const isPlaying = playerSource?.title === video.title;
                  return (
                    <div
                      key={video.id}
                      className={`flex items-center gap-4 p-3 border rounded-xl transition-all ${
                        isPlaying
                          ? "border-[#004080]/30 bg-[#004080]/4 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative w-[145px] h-[82px] bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => playVideo(video)}
                      >
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Video className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                        {/* play overlay */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isPlaying ? "bg-[#004080]/40" : "bg-black/0 hover:bg-black/40"}`}>
                          {isPlaying ? (
                            <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <Pause className="w-3.5 h-3.5 text-[#004080]" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/0 hover:bg-white/90 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
                              <Play className="w-3.5 h-3.5 text-gray-900 ml-0.5" />
                            </div>
                          )}
                        </div>
                        {/* duration badge */}
                        {video.duration && (
                          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/75 rounded text-[10px] text-white font-medium tabular-nums">
                            {video.duration}
                          </div>
                        )}
                        {/* new badge */}
                        {"isLocal" in video && video.isLocal && (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#004080] rounded text-[9px] text-white font-semibold">
                            NEW
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-semibold mb-0.5 truncate ${
                            isPlaying ? "text-[#004080]" : "text-gray-900"
                          }`}
                        >
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                          {video.description || "No description"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          {video.views !== undefined && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views.toLocaleString()} views
                            </span>
                          )}
                          {"fileSize" in video && video.fileSize && (
                            <span>{video.fileSize}</span>
                          )}
                          {video.uploadDate && (
                            <span>{video.uploadDate}</span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
                              video.status === "published"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                video.status === "published" ? "bg-emerald-500" : "bg-amber-400"
                              }`}
                            />
                            {video.status === "published" ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => playVideo(video)}
                          className="p-2 text-[#004080] hover:bg-[#004080]/10 rounded-lg transition-colors"
                          title="Play"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {"isLocal" in video && video.isLocal ? (
                          <button
                            onClick={() => deleteUploadedVideo(video.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT COLUMN — Upload Form ════════════════════════════════════ */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 sticky top-6 space-y-5"
          >
            {/* header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#004080]/10 flex items-center justify-center">
                <Upload className="w-4 h-4 text-[#004080]" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Upload Video</h2>
            </div>

            {/* ── File Upload ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video File <span className="text-red-500">*</span>
              </label>

              {formData.videoFile ? (
                /* Uploaded state */
                <div>
                  {isUploading ? (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#004080]/10 flex items-center justify-center flex-shrink-0">
                          <Video className="w-4 h-4 text-[#004080]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {formData.videoFile.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(formData.videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Uploading…</span>
                        <span className="font-medium">{Math.min(100, Math.round(uploadProgress))}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#004080] rounded-full transition-all duration-200"
                          style={{ width: `${Math.min(100, uploadProgress)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-emerald-900 truncate">
                          {formData.videoFile.name}
                        </p>
                        <p className="text-xs text-emerald-600">
                          Ready · {(formData.videoFile.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((p) => ({ ...p, videoFile: null }));
                          setUploadProgress(0);
                        }}
                        className="text-emerald-500 hover:text-emerald-700 flex-shrink-0 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Drop zone */
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-[#004080] bg-[#004080]/5"
                      : "border-gray-200 hover:border-[#004080]/40 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("video-file-input")?.click()}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">MP4, WebM (max 2GB)</p>
                  <input
                    id="video-file-input"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {uploadError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {uploadError}
                </div>
              )}
            </div>

            {/* ── Title ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Lecture 5 – Binary Trees"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
                required
              />
            </div>

            {/* ── Description ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Brief description…"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value.slice(0, 500) }))
                }
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{formData.description.length} / 500</p>
            </div>

            {/* ── Course ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData((p) => ({ ...p, courseId: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/10 transition-all"
                required
              >
                <option value="">Select a course…</option>
                {publishedCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} – {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Availability Schedule ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-3.5 h-3.5 text-[#004080]" />
                <span className="text-sm font-medium text-gray-700">Availability</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                      className="w-full pl-7 pr-2 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Start Time <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))}
                      className="w-full pl-7 pr-2 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    End Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                      className="w-full pl-7 pr-2 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    End Time <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData((p) => ({ ...p, endTime: e.target.value }))}
                      className="w-full pl-7 pr-2 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#004080] transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2.5 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">Note:</span> Students can only access this video within the specified window.
                </p>
              </div>
            </div>

            {/* ── Buttons ── */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 text-sm font-semibold text-white bg-[#004080] rounded-xl hover:bg-[#003060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading…" : "Upload Video"}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}