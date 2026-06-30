import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import SalonDetail from './pages/SalonDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/salon/:id" element={<SalonDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;