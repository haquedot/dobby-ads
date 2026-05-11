import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Layout = () => (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 p-6">
    <Sidebar />
    <main className="glass-panel shadow-soft rounded-3xl p-6 lg:p-10">
      <Outlet />
    </main>
  </div>
);

export default Layout;
