import { Download, Trash } from "lucide-react";
import formatBytes from "../utils/formatBytes.js";

const ImageGrid = ({ images, onDelete }) => (
  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {images.map((image) => {
      const imageUrl =
        image.url ||
        (image.filename
          ? `${import.meta.env.VITE_API_URL}/uploads/${image.filename}`
          : "");

      return (
        <div key={image._id} className="rounded-2xl bg-white/70 p-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={image.name}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
          )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium truncate max-w-[180px]">{image.name}</p>
            <p className="text-xs text-ink/60">{formatBytes(image.size)}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${import.meta.env.VITE_API_URL}/api/images/download/${image._id}`}
              className="p-2 rounded-lg hover:bg-mist"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={() => onDelete(image._id)}
              className="p-2 rounded-lg hover:bg-mist"
            >
              <Trash className="h-4 w-4 text-coral" />
            </button>
          </div>
        </div>
        </div>
      );
    })}
    {images.length === 0 && (
      <p className="text-sm text-ink/60">No images uploaded yet.</p>
    )}
  </div>
);

export default ImageGrid;
