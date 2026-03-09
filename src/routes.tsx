import { createBrowserRouter } from "react-router";
import { Layout } from "./components/dashboard/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { CourseActivities } from "./pages/CourseActivities";
import { AddActivity } from "./pages/AddActivity";
import { Students } from "./pages/Students";
import { Gradebook } from "./pages/Gradebook";
import { Schedule } from "./pages/Schedule";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/courses", element: <Courses /> },
      { path: "/courses/:courseId/activities", element: <CourseActivities /> },
      { path: "/add-activity", element: <AddActivity /> },
      { path: "/students", element: <Students /> },
      { path: "/gradebook", element: <Gradebook /> },
      { path: "/schedule", element: <Schedule /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);