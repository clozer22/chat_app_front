import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Index from '../src/pages/index'
import Login from './pages/Login';
import Particles from './components/Particles';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Verify from './pages/Verify';

function App() {
  return (
    <Router>
      <Particles id="tsparticles" />
      <div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetPassword" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/messages/:userId/:recipientId" element={<Index />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
