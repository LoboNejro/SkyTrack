import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Tasks from "./pages/Tasks";
import Notes from "./pages/Notes";
import NoteDetail from "./pages/NoteDetail";
import Contacts from "./pages/Contacts";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const clerkEnabled = !!(import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to={clerkEnabled ? "/sign-in" : "/login"} replace />} />
              <Route path="/login" element={clerkEnabled ? <Navigate to="/sign-in" replace /> : <Login />} />
              <Route path="/register" element={clerkEnabled ? <Navigate to="/sign-up" replace /> : <Register />} />

              {clerkEnabled && (
                <>
                  <Route path="/sign-in" element={<div className="min-h-screen flex items-center justify-center p-4"><SignIn routing="path" path="/sign-in" /></div>} />
                  <Route path="/sign-up" element={<div className="min-h-screen flex items-center justify-center p-4"><SignUp routing="path" path="/sign-up" /></div>} />
                </>
              )}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="classes" element={<Classes />} />
                <Route path="classes/:classId" element={<ClassDetail />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="notes" element={<Notes />} />
                <Route path="notes/:noteId" element={<NoteDetail />} />
                <Route path="contacts" element={<Contacts />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
