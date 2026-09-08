import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ToastProvider } from "./components/ui/Toast";
import { ThemeProvider } from "./components/ui/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Conversations from "./pages/Conversations";
import Agents from "./pages/Agents";
import Routing from "./pages/Routing";
import Activity from "./pages/Activity";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import Login from "./pages/Login";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/routing" element={<Routing />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/help" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
