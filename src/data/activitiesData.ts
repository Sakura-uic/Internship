export interface Activity {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: "video" | "assignment" | "quiz";
  duration?: string;
  views?: number;
  startDate?: string;
  endDate?: string;
  status: "published" | "draft" | "scheduled";
  youtubeUrl?: string;
}

// Course IDs match your existing mockData.ts: cs101, cs301, cs501, cs205, cs401, cs601
const activities: Activity[] = [
  // CS101 – Introduction to Programming
  {
    id: "act-cs101-1",
    courseId: "cs101",
    title: "Introduction to Programming Concepts",
    description: "Basic overview of programming fundamentals and course structure",
    type: "video",
    duration: "45 min",
    views: 118,
    startDate: "2026-01-10",
    endDate: "2026-05-31",
    status: "published",
    youtubeUrl: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
  },
  {
    id: "act-cs101-2",
    courseId: "cs101",
    title: "Variables and Data Types",
    description: "Understanding different data types and variable declaration",
    type: "video",
    duration: "38 min",
    views: 115,
    startDate: "2026-01-15",
    endDate: "2026-05-31",
    status: "published",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "act-cs101-3",
    courseId: "cs101",
    title: "Control Flow and Loops",
    description: "Learning conditional statements and iteration structures",
    type: "video",
    duration: "52 min",
    views: 102,
    startDate: "2026-02-01",
    endDate: "2026-05-31",
    status: "published",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // CS301 – Data Structures & Algorithms
  {
    id: "act-cs301-1",
    courseId: "cs301",
    title: "Big-O Notation Explained",
    description: "Time and space complexity analysis for common algorithms",
    type: "video",
    duration: "42 min",
    views: 91,
    startDate: "2026-01-12",
    endDate: "2026-05-31",
    status: "published",
  },
  {
    id: "act-cs301-2",
    courseId: "cs301",
    title: "Linked Lists from Scratch",
    description: "Build a singly and doubly linked list implementation step by step",
    type: "video",
    duration: "55 min",
    views: 78,
    startDate: "2026-01-20",
    endDate: "2026-05-31",
    status: "published",
  },
  {
    id: "act-cs301-3",
    courseId: "cs301",
    title: "Binary Search Trees",
    description: "Insert, delete and search operations with visual walkthroughs",
    type: "video",
    duration: "48 min",
    views: 63,
    startDate: "2026-02-05",
    endDate: "2026-05-31",
    status: "published",
  },

  // CS501 – Machine Learning Fundamentals
  {
    id: "act-cs501-1",
    courseId: "cs501",
    title: "What is Machine Learning?",
    description: "A high-level overview of supervised, unsupervised, and reinforcement learning",
    type: "video",
    duration: "38 min",
    views: 76,
    startDate: "2026-01-08",
    endDate: "2026-05-31",
    status: "published",
  },
  {
    id: "act-cs501-2",
    courseId: "cs501",
    title: "Linear Regression Deep Dive",
    description: "Cost function, gradient descent, and model evaluation from scratch",
    type: "video",
    duration: "61 min",
    views: 52,
    startDate: "2026-01-22",
    endDate: "2026-05-31",
    status: "published",
  },

  // CS205 – Operating Systems
  {
    id: "act-cs205-1",
    courseId: "cs205",
    title: "Process Scheduling Algorithms",
    description: "FCFS, SJF, Round Robin and Priority scheduling with examples",
    type: "video",
    duration: "44 min",
    views: 88,
    startDate: "2026-01-14",
    endDate: "2026-05-31",
    status: "published",
  },
  {
    id: "act-cs205-2",
    courseId: "cs205",
    title: "Memory Management & Paging",
    description: "Virtual memory, page tables, TLB and demand paging explained",
    type: "video",
    duration: "57 min",
    views: 71,
    startDate: "2026-02-10",
    endDate: "2026-05-31",
    status: "published",
  },
];

export function getActivitiesByCourseId(courseId: string): Activity[] {
  return activities.filter((a) => a.courseId === courseId);
}