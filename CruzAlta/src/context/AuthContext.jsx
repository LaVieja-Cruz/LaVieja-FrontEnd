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


  useEffect(() => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decoded = jwtDecode(token);
     
      setIsLoggedIn(true);

      // Accede a la propiedad `role` usando la ruta correcta
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role) {
        setRole(role);  // Guarda el Rol en el estado
      } else {
        console.error("El token no contiene la propiedad 'role'.");
      }
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

  // Accede al role correctamente
  const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  setRole(role);
};


  const logout = () => {
    stopTracking();
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
