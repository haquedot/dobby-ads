import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Upload, Trash2, Pencil } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FolderGrid from "../components/FolderGrid.jsx";
import ImageGrid from "../components/ImageGrid.jsx";
import CreateFolderModal from "../components/Modals/CreateFolderModal.jsx";
import UploadImageModal from "../components/Modals/UploadImageModal.jsx";
import {
  createFolder,
  deleteFolder,
  getChildren,
  getFolder,
  getRootFolders,
  renameFolder,
} from "../api/folders.js";
import { deleteImage, getImagesByFolder, uploadImage } from "../api/images.js";

const FolderExplorer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (!id) {
        const rootFolders = await getRootFolders();
        setFolders(rootFolders.data.data.folders);
        setImages([]);
        setCurrentFolder({ name: "Root", path: "/" });
      } else {
        const [folderRes, childrenRes, imagesRes] = await Promise.all([
          getFolder(id),
          getChildren(id),
          getImagesByFolder(id),
        ]);
        setCurrentFolder(folderRes.data.data.folder);
        setFolders(childrenRes.data.data.folders);
        setImages(imagesRes.data.data.images);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load folder");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCreateFolder = async (name) => {
    if (!name.trim()) return;
    await createFolder({ name, parentFolderId: id || null });
    setShowCreate(false);
    loadData();
  };

  const handleUploadImage = async (file) => {
    if (!id) {
      setError("Select a folder before uploading images");
      return;
    }
    const form = new FormData();
    form.append("folderId", id);
    form.append("image", file);
    await uploadImage(form);
    setShowUpload(false);
    loadData();
  };

  const handleDeleteImage = async (imageId) => {
    await deleteImage(imageId);
    loadData();
  };

  const handleRenameFolder = async () => {
    if (!id) return;
    const name = window.prompt("New folder name");
    if (!name) return;
    await renameFolder(id, { name });
    loadData();
  };

  const handleDeleteFolder = async () => {
    if (!id) return;
    const ok = window.confirm("Delete this folder and all nested items?");
    if (!ok) return;
    await deleteFolder(id);
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="text-sm text-ink/60">Loading folder...</div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">{currentFolder?.name}</h2>
            <Breadcrumbs path={currentFolder?.path} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-white"
            >
              <Plus className="h-4 w-4" />
              New folder
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coral text-white"
            >
              <Upload className="h-4 w-4" />
              Upload image
            </button>
            {id && (
              <button
                onClick={handleRenameFolder}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border"
              >
                <Pencil className="h-4 w-4" />
                Rename
              </button>
            )}
            {id && (
              <button
                onClick={handleDeleteFolder}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-coral"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
      </header>

      <section>
        <h3 className="text-lg font-semibold mb-4">Folders</h3>
        <FolderGrid folders={folders} />
      </section>

      {id && (
        <section>
          <h3 className="text-lg font-semibold mb-4">Images</h3>
          <ImageGrid images={images} onDelete={handleDeleteImage} />
        </section>
      )}

      <CreateFolderModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateFolder}
      />
      <UploadImageModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUploadImage}
      />
    </div>
  );
};

export default FolderExplorer;
