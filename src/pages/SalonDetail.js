import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './SalonDetail.css';

function SalonDetail() {
  // useParams reads the :id from the URL
  // e.g. /salon/abc123 → id = "abc123"
  const { id } = useParams();
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalonData();
  }, [id]); // Re-runs if the id in the URL ever changes

  const fetchSalonData = async () => {
    try {
      // Fetch salon details and its services in parallel
      const [salonRes, servicesRes] = await Promise.all([
        API.get(`/salons/${id}`),
        API.get(`/services/salon/${id}`)
      ]);
      setSalon(salonRes.data.salon);
      setServices(servicesRes.data.services);
    } catch (err) {
      setError('Could not load salon details.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle a service in/out of the selected list
  const toggleService = (service) => {
    const alreadySelected = selectedServices.find(s => s._id === service._id);
    if (alreadySelected) {
      setSelectedServices(selectedServices.filter(s => s._id !== service._id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const isSelected = (serviceId) => {
    return selectedServices.some(s => s._id === serviceId);
  };

  // Calculate running total of selected services
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.base_price, 0);

  const handleProceedToBooking = () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    // We'll pass selected services to the booking page via navigation state
    navigate(`/book/${id}`, { state: { salon, selectedServices } });
  };

  if (loading) return <div className="salon-detail-state">Loading...</div>;
  if (error) return <div className="salon-detail-state salon-detail-error">{error}</div>;
  if (!salon) return null;

  return (
    <div className="salon-detail-page">
      <header className="salon-detail-header">
        <button className="salon-detail-back" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <h1 className="salon-detail-logo">GroomKart</h1>
      </header>

      <div className="salon-detail-hero">
        <div className="salon-detail-hero-image">
          {salon.name.charAt(0)}
        </div>
        <div className="salon-detail-hero-info">
          <h2>{salon.name}</h2>
          <p className="salon-detail-location">{salon.location?.address}, {salon.location?.city}</p>
          <p className="salon-detail-desc">{salon.description}</p>
          <div className="salon-detail-tags">
            <span className="salon-detail-tag">⭐ {salon.avg_rating || 'New'}</span>
            {salon.offers_luxury && (
              <span className="salon-detail-tag salon-detail-luxury">Luxury Tier</span>
            )}
          </div>
        </div>
      </div>

      <div className="salon-detail-services">
        <h3>Select Services</h3>

        {services.length === 0 && (
          <p className="salon-detail-state">No services available yet.</p>
        )}

        <div className="service-list">
          {services.map((service) => (
            <div
              key={service._id}
              className={`service-item ${isSelected(service._id) ? 'service-item-selected' : ''}`}
              onClick={() => toggleService(service)}
            >
              <div className="service-item-info">
                <h4>{service.name}</h4>
                <p>{service.description}</p>
                <span className="service-item-duration">{service.duration_mins} mins</span>
              </div>
              <div className="service-item-right">
                <span className="service-item-price">₹{service.base_price}</span>
                <div className={`service-checkbox ${isSelected(service._id) ? 'service-checkbox-checked' : ''}`}>
                  {isSelected(service._id) && '✓'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="salon-detail-footer">
          <div className="salon-detail-footer-info">
            <span>{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</span>
            <span className="salon-detail-footer-price">₹{totalPrice}</span>
          </div>
          <button className="salon-detail-footer-btn" onClick={handleProceedToBooking}>
            Continue to Booking →
          </button>
        </div>
      )}
    </div>
  );
}

export default SalonDetail;