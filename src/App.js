import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Index from '../src/pages/index'

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/messages/:userId/:recipientId" element={<Index />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
