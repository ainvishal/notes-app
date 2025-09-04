import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SharedNote = () => {
  const { id } = useParams(); // Get note ID from URL
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${id}`);
        setNote(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load note: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!note) return <div className="text-center p-6">Note not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <p className="text-gray-700">{note.content}</p>
      <p className="text-sm text-gray-500 mt-4">Note ID: {note.id}</p>
    </div>
  );
};

export default SharedNote;