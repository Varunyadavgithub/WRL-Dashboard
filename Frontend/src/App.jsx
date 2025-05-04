import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import NavBar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { loginUser } from "./redux/authSlice"; // Import actions

function App() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  // Get authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Simulate checking authentication from a session or token
  useEffect(() => {
    // You could check token expiration here if needed
    if (user) {
      // User is authenticated if there's user info
      dispatch(loginUser(user)); // Optionally dispatch login if needed
    }
  }, [dispatch, user]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <div className="flex flex-col h-screen">
              <NavBar />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar
                  isSidebarExpanded={isSidebarExpanded}
                  toggleSidebar={toggleSidebar}
                />
                <div
                  className={`flex-1 transition-all duration-300 ease-in-out min-h-screen overflow-auto ${
                    isSidebarExpanded ? "ml-64" : "ml-16"
                  }`}
                >
                  <MainContent />
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
