import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Home.css';

function Home() {
  // This will store the list of salons we fetch from backend
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get the logged in user's name from localStorage
  const user = JSON.parse(localStorage.getItem('groomkart_user') || '{}');

  // useEffect runs automatically when the page first loads
  // This is how we fetch data from our backend the moment the screen opens
  useEffect(() => {
    fetchSalons();
  }, []); // Empty array means "run this only once, when page loads"

  const fetchSalons = async () => {
    try {
      const response = await API.get('/salons');
      setSalons(response.data.salons);
    } catch (err) {
      setError('Could not load salons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('groomkart_token');
    localStorage.removeItem('groomkart_user');
    window.location.href = '/';
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-logo">GroomKart</h1>
        <div className="home-header-right">
          <span className="home-greeting">Hi, {user.name?.split(' ')[0] || 'there'}</span>
          <button className="home-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="home-hero">
        <h2>Premium grooming, delivered to you</h2>
        <p>Choose a trusted salon near you and book your appointment in minutes</p>
      </section>

      <section className="home-salons">
        <h3 className="home-section-title">Salons near you</h3>

        {loading && <p className="home-state-text">Loading salons...</p>}
        {error && <p className="home-state-text home-error">{error}</p>}

        {!loading && !error && salons.length === 0 && (
          <p className="home-state-text">No salons available yet.</p>
        )}

        <div className="home-salon-grid">
          {salons.map((salon) => (
  <div
    key={salon._id}
    className="salon-card"
    onClick={() => navigate(`/salon/${salon._id}`)}
  >
              <div className="salon-card-image-placeholder">
                {salon.name.charAt(0)}
              </div>
              <div className="salon-card-body">
                <h4>{salon.name}</h4>
                <p className="salon-card-location">{salon.location?.city}</p>
                <p className="salon-card-desc">{salon.description}</p>
                <div className="salon-card-footer">
                  <span className="salon-card-rating">
                    ⭐ {salon.avg_rating || 'New'}
                  </span>
                  {salon.offers_luxury && (
                    <span className="salon-card-luxury-tag">Luxury</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;