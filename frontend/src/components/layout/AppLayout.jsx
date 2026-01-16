// src/components/layout/AppLayout.jsx

// IMPORTACIONS
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// ESTILS
const LAYOUT_CONTAINER = "flex h-screen bg-white font-sans antialiased text-gray-900";
const CONTENT_WRAPPER = "flex-1 flex flex-col overflow-hidden";
const MAIN_AREA = "flex-1 overflow-y-auto p-6";

export default function AppLayout() {
  // RENDERITZAT (ESTRUCTURA GENERAL)
  return (
    <div className={LAYOUT_CONTAINER}>
      <Sidebar />
      <div className={CONTENT_WRAPPER}>
        <Navbar />
        <main className={MAIN_AREA}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}