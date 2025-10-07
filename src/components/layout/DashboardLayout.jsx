import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header at top, full width */}
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex w-full" style={{ height: "calc(100vh - 4rem)" }}>
        {/* Sidebar below header, scrolls internally */}
        <div className="h-full">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>
        {/* Dashboard content with top rounded corners, no top margin/padding */}
        <main className="flex-1 overflow-auto bg-white shadow py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
