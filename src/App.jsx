import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import CommunityForest from "./pages/CommunityForest";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Run from "./pages/Run";
import Runs from "./pages/Runs";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= Public Pages ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/community"
          element={<Community />}
        />

        <Route
          path="/community/forest"
          element={<CommunityForest />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ================= Authentication ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= Protected Pages ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/run"
          element={
            <ProtectedRoute>
              <Run />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/runs"
          element={
            <ProtectedRoute>
              <Runs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;