import { useState } from "react";

const CreateFolderModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate(name);
    setName("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-ink/40 grid place-items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4"
      >
        <h3 className="font-display text-lg">Create folder</h3>
        <input
          className="w-full border rounded-xl px-3 py-2"
          placeholder="Folder name"
          value={name}
          onChange={(event) => setName(event.target.value)}
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
            className="px-4 py-2 rounded-xl bg-ocean text-white"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFolderModal;
