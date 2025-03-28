import React from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Dashboard from "./Components/DashboardComponent/DashboardComponent";
import WorkoutPlanComponent from "./Components/WorkoutPlanComponent/WorkoutPlanComponent";
import logo from "./assets/logo.jpg";
import ProtectedRoute from "./Components/Authentication/ProtectedRoute";
import {
  AuthProvider,
  AuthContext,
} from "./Components/Authentication/AuthContext"; // Import AuthProvider and AuthContext
import WorkoutComponent from "./Components/WorkoutComponent/WorkoutComponent";
import MyPlanComponent from "./Components/MyPlanComponent/MyPlanComponent";
import { Analytics } from "@vercel/analytics/react";
import SignUpComponent from "./Components/SignUpComponent/SignUpComponent";
import LoginComponent from "./Components/LoginComponent/LoginComponent";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Nav />
          <Routes>
            <Route path="/login" element={<LoginComponent/>} />
            <Route path="/signup" element={<SignUpComponent/>} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workoutplan"
              element={
                <ProtectedRoute>
                  <WorkoutPlanComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/start-workout/:planId/:dayIndex"
              element={
                <ProtectedRoute>
                  <WorkoutComponent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <MyPlanComponent />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<IndexRoute />} />
          </Routes>
        </div>
        <Analytics />
      </BrowserRouter>
    </AuthProvider>
  );
};

const IndexRoute = () => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const Nav = () => {
  const { isAuthenticated, logout } = React.useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between sm:flex-row flex-col gap-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-semibold flex items-center gap-2"
          >
            <img className="bg-white rounded-3xl w-10" src={logo} alt="logo" />
            Fitness App
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-gray-300 transition duration-150"
              >
                Dashboard
              </Link>
              <Link
                to="/workoutplan"
                className="hover:text-gray-300 transition duration-150"
              >
                Workout Plans
              </Link>
              <Link
                to="/user"
                className="hover:text-gray-300 transition duration-150"
              >
                My Plan
              </Link>
              <button
                onClick={logout}
                className="hover:text-gray-300 transition duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300 transition duration-150"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-gray-300 transition duration-150"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default App;