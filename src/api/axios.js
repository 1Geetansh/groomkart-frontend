import axios from 'axios';

// This is the base configuration for talking to our backend
// Every API call in our app will use this setup
const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
  // This means we don't have to type the full URL every time
  // Instead of 'http://127.0.0.1:8000/api/auth/login'
  // We just write '/auth/login'
});

// This is an interceptor — it runs BEFORE every single API request
// It automatically attaches the JWT token if the user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('groomkart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;