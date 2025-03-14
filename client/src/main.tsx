import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import Navbar from "./components/NavBar";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
  <BrowserRouter>
    <div className="flex flex-col h-screen">
      <Navbar /> {/* Fixed height element */}
      <Toaster richColors position="top-center" />

      {/* Dashboard should only take remaining height */}
      <div className="flex-1 flex overflow-hidden">
        <App />
      </div>
    </div>
  </BrowserRouter>
</React.StrictMode>

);
