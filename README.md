# IIT Kanpur LMS — Instructor Dashboard

A clean, professional, production-ready **Learning Management System (LMS) Dashboard** built for IIT Kanpur instructors. Designed as the scalable foundation for a full LMS platform, with real interactive functionality wired through a shared application state layer.

---

## ✨ Features

### Pages
- 📊 **Dashboard** — Live KPI cards (pending count updates as you grade), dynamic time-of-day greeting, weekly activity chart, grading queue, upcoming exams, course activity table
- 📚 **Courses** — Card grid with create, publish, and unpublish functionality
- 👥 **Students** — Searchable, filterable table with expandable inline detail panels
- 📝 **Gradebook** — Grade distribution bar chart and per-student performance overview
- 📅 **Schedule** — Weekly timetable grid + sortable session list
- ⚙️ **Settings** — Profile editor with unsaved-changes tracking, notification toggles

### Functional Interactions
- 🎓 **Grade submissions** — Modal with score input, live grade preview (A+/A/B+…), animated score bar, optional feedback; grading an item removes it from the queue and updates the Dashboard KPI counter in real time
- ➕ **Create courses** — Validated modal (name + course code format check); new course card appears immediately in the grid
- 👁️ **Publish / Unpublish** — Toggle course visibility with a spinner and instant toast confirmation
- 🗂️ **Student detail panels** — Click any student row to expand contact info, grade, attendance, enrolled courses, and quick actions inline
- 💾 **Settings save flow** — Changed fields highlight amber; Save button activates only when there are unsaved changes; Discard reverts all edits
- 🔔 **Toast notifications** — App-wide success / info / error toasts triggered by all major actions
- 🔔 **Notification bell** — Unread badge, mark-all-read, per-item read state
- 🦴 **Loading states** — Skeleton shimmer animations on all panels during the initial simulated fetch (1.2 s)
- 📱 **Responsive layout** — Desktop and tablet optimised; collapsible sidebar

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Primary** | `#004080` (IIT Kanpur Blue) |
| **Border radius** | `12px` |
| **Font** | Inter (Google Fonts) |
| **Page background** | `#f8f9fb` |
| **Card shadow** | Subtle two-layer `box-shadow` |
| **Theme** | Light mode only |
| **Animations** | CSS `@keyframes` — `fadeIn`, `slideUp`, `shimmer` |

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── charts/
│   │   └── ActivityChart.tsx       # Recharts AreaChart with All / Submissions / Logins toggle
│   ├── dashboard/
│   │   ├── Layout.tsx              # Root shell: AppProvider + LoadingProvider + Sidebar + TopBar + Outlet + ToastContainer
│   │   ├── Sidebar.tsx             # Collapsible nav sidebar (React Router NavLink active states)
│   │   ├── TopBar.tsx              # Search bar, notification dropdown, profile dropdown
│   │   ├── CourseTable.tsx         # Sortable course activity table (reads from AppContext)
│   │   ├── GradingQueue.tsx        # Priority queue; opens GradeModal on "Grade" click
│   │   ├── GradeModal.tsx          # Score input, live grade badge, feedback textarea, async submit
│   │   ├── NewCourseModal.tsx      # Create course form with validation and status selector
│   │   └── UpcomingExams.tsx       # Exam list with urgency colour coding (red / amber / green)
│   ├── shared/
│   │   ├── Shimmer.tsx             # KPICardSkeleton, TableRowSkeleton, ChartSkeleton, ListSkeleton
│   │   ├── EmptyState.tsx          # Centred empty state with icon and optional CTA button
│   │   ├── ProgressBar.tsx         # Auto-colour progress bar (green ≥85 / amber ≥70 / red <70)
│   │   └── ToastContainer.tsx      # Fixed bottom-right toast stack (success / info / error)
│   └── ui/
│       └── KPICard.tsx             # Stat card with icon, trend indicator + CompletionKPICard variant
├── context/
│   ├── AppContext.tsx              # Central app state: courses, gradingQueue, students, toasts + all mutators
│   └── LoadingContext.tsx          # One-time 1.2 s loading simulation on mount
├── data/
│   └── mockData.ts                 # Seed data for courses, students, grading queue, exams, schedule, notifications
├── pages/
│   ├── Dashboard.tsx               # KPI grid + chart row + table row; reads live counts from AppContext
│   ├── Courses.tsx                 # Course cards; New Course modal; Publish/Unpublish per card
│   ├── Students.tsx                # Searchable/filterable table; expandable inline detail row
│   ├── Gradebook.tsx               # Grade distribution BarChart + student performance table
│   ├── Schedule.tsx                # Day-column weekly grid + flat session table
│   └── Settings.tsx                # Profile form (unsaved tracking) + notification toggles + security
├── utils/
│   └── cn.ts                       # clsx + tailwind-merge helper; timeAgo, formatDate, daysUntil utilities
├── routes.tsx                      # createBrowserRouter route tree
├── App.tsx                         # RouterProvider root
├── main.tsx                        # Vite entry point
└── index.css                       # Tailwind directives + shimmer / fadeIn / slideUp keyframes
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or pnpm / yarn)

### Run locally

```bash
# 1. Unzip and enter the project
unzip iitk-lms-functional.zip
cd iitk-lms

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

---

## 🔧 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI library |
| Vite | 6 | Build tool & dev server |
| TypeScript | 5.7 | Type safety throughout |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Recharts | 2.15 | AreaChart (activity) + BarChart (grades) |
| Lucide React | 0.469 | Icon set |
| clsx + tailwind-merge | latest | Safe className composition |

---

## 🏗️ Architecture

### Atomic Design layers
| Layer | Folder | Examples |
|-------|--------|---------|
| Atoms | `components/shared/` | `Shimmer`, `ProgressBar`, `EmptyState`, `ToastContainer` |
| Molecules | `components/ui/` | `KPICard`, `CompletionKPICard` |
| Organisms | `components/dashboard/` | `Sidebar`, `TopBar`, `GradingQueue`, `GradeModal`, `CourseTable` |
| Charts | `components/charts/` | `ActivityChart` |
| Templates / Pages | `pages/` | `Dashboard`, `Courses`, `Students`, … |

### State management
The project uses two React Contexts:

**`AppContext`** (`src/context/AppContext.tsx`) — the single source of truth for all mutable app data:
- `courses` + `addCourse` + `updateCourseStatus`
- `gradingQueue` + `gradeSubmission`
- `students`
- `toasts` + `addToast` + `removeToast`

All pages and components that need shared data consume `useAppContext()`. No prop drilling.

**`LoadingContext`** (`src/context/LoadingContext.tsx`) — simulates a 1.2 s initial data fetch so skeleton states are visible on first load. Replace the `setTimeout` with real API calls when connecting a backend.

### Cross-component reactivity in action
| User action | What updates automatically |
|-------------|---------------------------|
| Grade a submission | Removed from `GradingQueue`; "Pending Grading" KPI on Dashboard drops |
| Create a new course | Card appears in `Courses` grid; "Active Courses" KPI on Dashboard increments |
| Publish / Unpublish a course | Card moves between Published / Drafts sections on `Courses`; Dashboard course counts update |

---

## 📸 Pages

| Route | Page | Key interactions |
|-------|------|-----------------|
| `/` | Dashboard | Live KPI counts, dynamic greeting, activity chart toggle |
| `/courses` | Courses | New Course modal, Publish/Unpublish toggle per card |
| `/students` | Students | Search, status filter, expandable detail row |
| `/gradebook` | Gradebook | Grade distribution chart, performance table |
| `/schedule` | Schedule | Day-column grid, flat session table |
| `/settings` | Settings | Unsaved-changes indicator, save/discard, notification toggles |

---

## 🔌 Connecting a Real Backend

1. **Replace mock data** — swap `src/data/mockData.ts` seed values with API responses
2. **Wire `AppContext` actions** — each mutator (`addCourse`, `gradeSubmission`, etc.) is the right place to add `fetch`/`axios` calls
3. **Use `LoadingContext`** — replace the `setTimeout` with the lifecycle of your actual data fetch (e.g., a `useQuery` `isLoading` flag)
4. **Add authentication** — wrap the router in an auth guard; the `Layout` component is the natural place to check session state

### Adding a new page
```bash
# 1. Create the page
touch src/pages/Assignments.tsx

# 2. Register the route (src/routes.tsx)
{ path: 'assignments', Component: Assignments }

# 3. Add a nav item (src/components/dashboard/Sidebar.tsx)
{ to: '/assignments', label: 'Assignments', icon: FileText }
```

---

## 🎯 Roadmap

- [ ] Individual course detail pages (`/courses/:id`)
- [ ] Assignment creation & submission management
- [ ] Student profile pages (`/students/:id`)
- [ ] Announcements system
- [ ] Dark mode toggle
- [ ] Export gradebook to CSV / PDF
- [ ] Backend API integration (REST or tRPC)
- [ ] Authentication (SSO / IITK LDAP)
- [ ] Mobile-first responsive sidebar (drawer / sheet)
- [ ] Real-time updates via WebSocket

---

## 🛠️ Development Notes

- `cn()` in `src/utils/cn.ts` wraps `clsx` + `tailwind-merge` — use it for all conditional class composition
- All Tailwind custom tokens (shadow, animation, color) live in `tailwind.config.js`
- CSS animations (`shimmer`, `fadeIn`, `slideUp`) are defined as `@keyframes` in `src/index.css` and exposed as Tailwind `animate-*` utilities
- The `path alias` `@/` maps to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`

---

*Built for IIT Kanpur · Spring 2026*