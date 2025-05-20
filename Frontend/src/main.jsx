import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Routes>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </Routes>
  </StrictMode>
);
