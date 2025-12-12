import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

import {
  AuthProvider as AdminAuthProvider,
  useAdminAuth,
} from "./contexts/AdminAuthContext";
import {
  StudentAuthProvider,
  useStudentAuth,
} from "./contexts/StudentAuthContext";

// Entry
import EntryPage from "./pages/Entry";

// Admin Pages
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import StudentManegement from "./pages/Admin/StudentManegement";
import Rankings from "./pages/Admin/Rankings";

// Student Pages
import StudentLogin from "./pages/Student/Login";
import StudentDashboard from "./pages/Student/Dashboard";

function AdminPrivateRoute({ children }: { children: JSX.Element }) {
  const { admin } = useAdminAuth();
  return admin ? children : <Navigate to="/admin/login" replace />;
}

function StudentPrivateRoute({ children }: { children: JSX.Element }) {
  const { student } = useStudentAuth();
  return student ? children : <Navigate to="/student/login" replace />;
}

export default function App() {
  return (
    <AdminAuthProvider>
      <StudentAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<EntryPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/rankings"
              element={
                <AdminPrivateRoute>
                  <Rankings />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminPrivateRoute>
                  <StudentManegement />
                </AdminPrivateRoute>
              }
            />

            {/* Student Routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route
              path="/student/dashboard"
              element={
                <StudentPrivateRoute>
                  <StudentDashboard />
                </StudentPrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </StudentAuthProvider>
    </AdminAuthProvider>
  );
}
