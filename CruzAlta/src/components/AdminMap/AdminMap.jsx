import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const AdminMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000); // actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("https://localhost:7042/api/ubicacion/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      setLocations(res.data);
    } catch (err) {
      console.error("Error obteniendo ubicaciones:", err);
    }
  };

  const icon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  return (
    <MapContainer center={[-33.1106, -61.5439]} zoom={14} style={{ height: "600px", width: "100%" }}>

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.map((loc) => (
        <Marker key={loc.idDelivery} position={[loc.lat, loc.lon]} icon={icon}>
          <Popup>
            <strong>{loc.userName}</strong><br />
            Lat: {loc.lat}<br />
            Lon: {loc.lon}<br />
            Actualizado: {new Date(loc.ultimaActualizacion).toLocaleTimeString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdminMap;
