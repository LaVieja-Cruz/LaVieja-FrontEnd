// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      setUser({ id, role, token }); // 👈 importante
      setRole(role);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error decodificando el token:", error);
    }
  }
}, []);


  const startTracking = (idUsuario, token) => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/ubicacion/update`,
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
  const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  setRole(role);
  setUser({ id, role, token }); // <-- NUEVO
};



  const logout = () => {
    stopTracking();
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role, user }}>

      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
