import { useState } from "react";

const UploadImageModal = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      onUpload(file);
      setFile(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-ink/40 grid place-items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4"
      >
        <h3 className="font-display text-lg">Upload image</h3>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-coral text-white"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadImageModal;
