import React, { useEffect, useState } from "react";
import axios from "axios";
const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login");
        return;
      }

      const payload = { title, description };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let data;

      if (note) {
        ({ data } = await axios.put(`/api/notes/${note._id}`, payload, config));
      } else {
        ({ data } = await axios.post(`/api/notes`, payload, config));
      }

      onSave(data);
      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (error) {
      console.log(error);
      setError("Failed to update notes");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {note ? "Edit Note" : "Create Note"}
        </h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 text-white border border-gray-600 rounded-md  bg-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 text-white border border-gray-600 rounded-md  bg-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {note ? "Update" : "Create"}
              </button>
              <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
