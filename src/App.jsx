import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import SharedNote from './SharedNote';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Notes App</h1>
        <Routes>
          <Route path="/" element={<><NoteForm /><NoteList /></>} />
          <Route path="/note/:id" element={<SharedNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;