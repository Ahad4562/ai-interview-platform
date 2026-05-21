import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Resume from "./pages/Resume";
import History from "./pages/History";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (


      <Routes>

        {/* Home */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Interview */}

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        {/* Resume */}

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />

        {/* History */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

      </Routes>


  );
}

export default App;