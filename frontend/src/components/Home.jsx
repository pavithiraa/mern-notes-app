import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "./NoteModal";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsOpenModel] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token founf.Please login");
        return;
      }

      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      setNotes(data);
      console.log(data);
    } catch (error) {
      setError("failed to fetch notes");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsOpenModel(true);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token founf.Please login");
        return;
      }

      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (error) {
      setError("failed to delete notes");
    }
  };

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(
        notes.map((note) => (note._id === newNote._id ? newNote : note))
      );
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setIsOpenModel(false);
    fetchNotes();
  };
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-500">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsOpenModel(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />
      <button
        onClick={() => setIsOpenModel(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-2xl hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="flex items-center justify-center h-full w-full pb-1">
          +
        </span>
      </button>
      {loading ? (
        <div className="text-black px-3 py-1 rounded-lg bg-white font-semibold text-2xl flex items-center justify-center">
          Loading..
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-medium text-white mg-2">
                {note.title}
              </h3>
              <p className="text-gray-300 mb-4">{note.description}</p>
              <p className="text-sm text-gray-400 mb-4">
                {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-600 px-3 py-1 text-white rounded-md hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-3 py-1 text-white rounded-md hover:bg-red-700"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
