import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import NavBar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            true ? (
              <div className="flex flex-col h-screen">
                <NavBar />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    toggleSidebar={toggleSidebar}
                  />
                  <div
                    className={`flex-1 transition-all duration-300 ease-in-out overflow-auto ${
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
      </Route>
    </Routes>
  );
}

export default App;
