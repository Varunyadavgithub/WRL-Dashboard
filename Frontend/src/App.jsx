import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import NavBar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
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
    </Routes>
  );
}

export default App;
