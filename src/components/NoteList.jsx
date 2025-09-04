import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteForm from './NoteForm.jsx';

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes/');
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error:', err);
    }
  };

  const handleAdd = (newNote) => {
    setNotes([...notes, newNote]);
    setError(null);
  };

  const handleUpdate = () => {
    setEditingNote(null);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      fetchNotes();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete note');
      console.error('Error:', err);
    }
  };

  const getShareUrl = (id) => `${window.location.origin}/note/${id}`;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Notes App</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <NoteForm onNoteAdded={handleAdd} editingNote={editingNote} onNoteUpdated={handleUpdate} />
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes available</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
              <p className="text-gray-600 mt-2">{note.content}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-sm text-blue-600">
                Share: <a href={getShareUrl(note.id)} className="underline hover:text-blue-800">{getShareUrl(note.id)}</a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoteList;