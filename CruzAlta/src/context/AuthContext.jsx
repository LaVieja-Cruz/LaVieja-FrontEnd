// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
      const decoded = jwtDecode(token);
      if (decoded.role === "3") {
        startTracking(decoded.sub, token); // sub = idUsuario
      }
    }
  }, []);

  const startTracking = (idUsuario, token) => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await axios.post(
            "https://localhost:7042/api/ubicacion/update",
            {
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (err) {
          console.error("Error actualizando ubicación:", err);
        }
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    setIsLoggedIn(true);

    const decoded = jwtDecode(token);
    if (decoded.role === "3") {
      startTracking(decoded.sub, token); // Delivery
    }
  };

  const logout = () => {
    stopTracking();
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
