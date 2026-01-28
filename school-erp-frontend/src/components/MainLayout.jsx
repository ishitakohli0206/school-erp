import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <Sidebar />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
