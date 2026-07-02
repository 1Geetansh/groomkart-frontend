import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Booking.css';

function Booking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get salon and selected services passed from SalonDetail page
  const { salon, selectedServices } = location.state || {};

  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '',
    street: '',
    city: 'Udaipur',
    pincode: '',
    distance_km: 5,
    booking_tier: 'standard',
    special_instructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  // Calculate pricing exactly like our backend does
  const basePrice = selectedServices?.reduce((sum, s) => sum + s.base_price, 0) || 0;
  const travelCost = Math.max(35, 2 * formData.distance_km * 4);
  const handlingCost = 30;
  const platformFee = Math.round(basePrice * 0.08);
  const luxurySurcharge = formData.booking_tier === 'luxury' ? Math.round(basePrice * 0.10) : 0;
  const total = basePrice + travelCost + handlingCost + platformFee + luxurySurcharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.booking_date || !formData.booking_time || !formData.street) {
      setError('Please fill in date, time and address');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/bookings', {
        salon_id: id,
        service_ids: selectedServices.map(s => s._id),
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
        distance_km: Number(formData.distance_km),
        booking_tier: formData.booking_tier,
        addons: [],
        special_instructions: formData.special_instructions
      });

      setBookingSuccess(response.data);

    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show success screen after booking
  if (bookingSuccess) {
    return (
      <div className="booking-success-page">
        <div className="booking-success-card">
          <div className="booking-success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>{bookingSuccess.message}</p>
          <div className="booking-success-details">
            <div className="booking-success-row">
              <span>Salon</span>
              <span>{salon?.name}</span>
            </div>
            <div className="booking-success-row">
              <span>Date</span>
              <span>{formData.booking_date}</span>
            </div>
            <div className="booking-success-row">
              <span>Time</span>
              <span>{formData.booking_time}</span>
            </div>
            <div className="booking-success-row">
              <span>Total paid</span>
              <span>₹{bookingSuccess.price_breakdown?.total}</span>
            </div>
          </div>
          <button
            className="booking-success-btn"
            onClick={() => navigate('/home')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <button className="booking-back" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="booking-logo">GroomKart</h1>
      </header>

      <div className="booking-layout">
        <div className="booking-form-section">
          <h2>Confirm your booking</h2>
          <p className="booking-subtitle">at {salon?.name}</p>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="booking-field-group">
              <label className="booking-label">
                Date
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </label>
            </div>

            <div className="booking-field-group">
              <label className="booking-label">Time slot</label>
              <div className="booking-time-grid">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`booking-time-slot ${formData.booking_time === slot ? 'booking-time-slot-selected' : ''}`}
                    onClick={() => setFormData({ ...formData, booking_time: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-field-group">
              <label className="booking-label">
                Street address
                <input
                  type="text"
                  name="street"
                  placeholder="e.g. 12 Lake Palace Road"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="booking-label">
                Pincode
                <input
                  type="text"
                  name="pincode"
                  placeholder="313001"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="booking-field-group">
              <label className="booking-label">
                Distance from salon (km)
                <input
                  type="number"
                  name="distance_km"
                  min="1"
                  max="20"
                  value={formData.distance_km}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="booking-field-group">
              <label className="booking-label">Booking tier</label>
              <div className="booking-tier-row">
                <button
                  type="button"
                  className={`booking-tier-btn ${formData.booking_tier === 'standard' ? 'booking-tier-selected' : ''}`}
                  onClick={() => setFormData({ ...formData, booking_tier: 'standard' })}
                >
                  Standard
                </button>
                <button
                  type="button"
                  className={`booking-tier-btn ${formData.booking_tier === 'luxury' ? 'booking-tier-selected' : ''}`}
                  onClick={() => setFormData({ ...formData, booking_tier: 'luxury' })}
                >
                  ✨ Luxury
                </button>
              </div>
              {formData.booking_tier === 'luxury' && (
                <p className="booking-luxury-note">
                  Includes aroma kit, perfume spray, and welcome packaging
                </p>
              )}
            </div>

            <div className="booking-field-group">
              <label className="booking-label">
                Special instructions (optional)
                <textarea
                  name="special_instructions"
                  placeholder="e.g. Please ring the bell twice"
                  value={formData.special_instructions}
                  onChange={handleChange}
                  rows={3}
                />
              </label>
            </div>

            {error && <p className="booking-error">{error}</p>}

            <button type="submit" className="booking-submit-btn" disabled={loading}>
              {loading ? 'Confirming...' : `Confirm Booking • ₹${total}`}
            </button>
          </form>
        </div>

        <div className="booking-summary-section">
          <h3>Order summary</h3>
          <div className="booking-summary-card">
            <div className="booking-summary-salon">{salon?.name}</div>

            {selectedServices?.map(s => (
              <div key={s._id} className="booking-summary-row">
                <span>{s.name}</span>
                <span>₹{s.base_price}</span>
              </div>
            ))}

            <div className="booking-summary-divider" />

            <div className="booking-summary-row">
              <span>Travel cost</span>
              <span>₹{travelCost}</span>
            </div>
            <div className="booking-summary-row">
              <span>Handling</span>
              <span>₹{handlingCost}</span>
            </div>
            <div className="booking-summary-row">
              <span>Platform fee (8%)</span>
              <span>₹{platformFee}</span>
            </div>
            {formData.booking_tier === 'luxury' && (
              <div className="booking-summary-row">
                <span>Luxury surcharge (10%)</span>
                <span>₹{luxurySurcharge}</span>
              </div>
            )}

            <div className="booking-summary-divider" />

            <div className="booking-summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;