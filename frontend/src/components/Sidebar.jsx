import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Folder, LogOut } from "lucide-react";
import { getRootFolders } from "../api/folders.js";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const [folders, setFolders] = useState([]);
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const loadRoots = async () => {
      const response = await getRootFolders();
      setFolders(response.data.data.folders);
    };
    loadRoots();
  }, [location.pathname]);

  return (
    <aside className="glass-panel shadow-soft rounded-3xl p-6 flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Dobby Ads</p>
        <h1 className="font-display text-2xl">Drive Space</h1>
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold mb-3">Root folders</p>
        <div className="space-y-2">
          {folders.map((folder) => (
            <Link
              key={folder._id}
              to={`/dashboard/folders/${folder._id}`}
              className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/60"
            >
              <Folder className="h-4 w-4 text-ocean" />
              <span className="text-sm truncate">{folder.name}</span>
            </Link>
          ))}
          {folders.length === 0 && (
            <p className="text-sm text-ink/50">No folders yet</p>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
