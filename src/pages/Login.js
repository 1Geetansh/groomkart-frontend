import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/auth/login', formData);
      localStorage.setItem('groomkart_token', response.data.token);
      localStorage.setItem('groomkart_user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand-panel">
        <span className="login-eyebrow">Doorstep grooming</span>
        <h1 className="login-logo">GroomKart</h1>
        <p className="login-proof">Trusted salons. Your doorstep.</p>
        <div className="login-brand-footer">
          For everyone — luxury when you want it, convenience when you need it.
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-wrap">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to book your next appointment</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
              Email
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="login-label">
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;