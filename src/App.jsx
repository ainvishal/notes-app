import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteList from './components/NoteList.jsx';
import SharedNote from './components/SharedNote.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<NoteList />} />
          <Route path="/note/:id" element={<SharedNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;