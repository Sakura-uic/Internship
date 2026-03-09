import { Play, Clock, Eye, Calendar } from "lucide-react";

interface ActivityItemProps {
  id: string;
  title: string;
  description: string;
  type: "video" | "assignment" | "quiz";
  duration?: string;
  views?: number;
  endDate?: string;
  status: "published" | "draft" | "scheduled";
  index: number;
}

function formatEndDate(dateStr?: string) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

const statusConfig = {
  published: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    dot: "bg-gray-400",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-600 border border-blue-100",
    dot: "bg-blue-500",
  },
};

export function ActivityItem({
  title,
  description,
  duration,
  views,
  endDate,
  status,
  index,
}: ActivityItemProps) {
  const cfg = statusConfig[status];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-all duration-150">
      {/* Number badge */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-500">{index}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-400 truncate mb-2">{description}</p>

            {/* Meta row — matches Figma: Video Lecture · duration · views · Available until */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Play className="w-3 h-3" />
                <span>Video Lecture</span>
              </div>
              {duration && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{duration}</span>
                </div>
              )}
              {views !== undefined && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>{views} views</span>
                </div>
              )}
              {endDate && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Available until {formatEndDate(endDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status pill */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${cfg.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}