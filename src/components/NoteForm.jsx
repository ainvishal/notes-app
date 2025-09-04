import React, { useState } from 'react';
import axios from 'axios';

const NoteForm = ({ onNoteAdded, editingNote, onNoteUpdated }) => {
  const [title, setTitle] = useState(editingNote ? editingNote.title : '');
  const [content, setContent] = useState(editingNote ? editingNote.content : '');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty');
      return;
    }
    const note = { title, content };
    try {
      setError(null);
      if (editingNote) {
        await axios.put(`/api/notes/${editingNote.id}`, note);
        onNoteUpdated();
      } else {
        const response = await axios.post('/api/notes/', note);
        onNoteAdded(response.data);
      }
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save note');
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        {editingNote ? 'Update Note' : 'Add Note'}
      </button>
    </form>
  );
};

export default NoteForm;