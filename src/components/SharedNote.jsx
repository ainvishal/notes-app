import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SharedNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`/api/notes/${id}`);
        setNote(response.data);
      } catch (error) {
        console.error('Note not found');
      }
    };
    fetchNote();
  }, [id]);

  if (!note) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shared Note</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
        <p className="text-gray-600 mt-2">{note.content}</p>
      </div>
    </div>
  );
};

export default SharedNote;