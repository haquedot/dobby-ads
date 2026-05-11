import { Folder } from "lucide-react";
import { Link } from "react-router-dom";
import formatBytes from "../utils/formatBytes.js";

const FolderGrid = ({ folders }) => (
  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {folders.map((folder) => (
      <Link
        to={`/dashboard/folders/${folder._id}`}
        key={folder._id}
        className="rounded-2xl border border-white/40 bg-white/60 p-4 hover:bg-white"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sand/60 flex items-center justify-center">
            <Folder className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <p className="font-medium text-ink">{folder.name}</p>
            <p className="text-xs text-ink/60">{formatBytes(folder.totalSize)}</p>
          </div>
        </div>
      </Link>
    ))}
    {folders.length === 0 && (
      <p className="text-sm text-ink/60">No folders in this location.</p>
    )}
  </div>
);

export default FolderGrid;
