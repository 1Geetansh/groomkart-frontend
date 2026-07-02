import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SalonDetail from './pages/SalonDetail';
import Booking from './pages/Booking';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
        <Route path="/book/:id" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;