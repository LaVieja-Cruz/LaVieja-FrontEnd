import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import motoIcon from "../../assets/delivery-bike.png";


const AdminMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000); // actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const icon = new L.Icon({
  iconUrl: motoIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ubicacion/all`, {

        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      setLocations(res.data);
    } catch (err) {
      console.error("Error obteniendo ubicaciones:", err);
    }
  };

  
   

  return (
    <MapContainer center={[-32.99029669632476, -61.792591957670815]} zoom={14} style={{ height: "600px", width: "100%" }}>

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
