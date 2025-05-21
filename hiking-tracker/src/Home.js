// src/Home.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Define map container style
const containerStyle = {
    width: '100%',
    height: '500px'
  };

  // Default center if no location yet
const defaultCenter = {
    lat: 19.0760, // Mumbai as fallback
    lng: 72.8777
  };
  

const Home = () => {
  const [position, setPosition] = useState([]);
  const [userId, setUserId] = useState('');

  
  // Use your API key here
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDJ0-bNl92wveTAvX4FF5QgD9ZjqPjIvzw', // <--- Replace this with your actual key
  });

 // Generate user ID and start location tracking
  useEffect(() => {
    const id = uuidv4();
    setUserId(id);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition((prev) => [...prev, { lat: latitude, lng: longitude }]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Save path to backend
  const savePath = async () => {
    await axios.post('http://localhost:5000/api/save', { userId, path: position });
    alert(`Path saved! Your User ID is: ${userId}`);
  };

   // Return loading state until map is ready
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Track Your Hiking Route</h2>
      <p><strong>Your ID:</strong> {userId}</p>

      {/* ✅ Google Map Component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position.length > 0 ? position[position.length - 1] : defaultCenter}
        zoom={15}
      >
        {/* Polyline for the trail */}
        {position.length > 1 && (
          <Polyline
            path={position}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 4
            }}
          />
        )}

        {/* Optional: Show current location marker */}
        {position.length > 0 && (
          <Marker position={position[position.length - 1]} />
        )}
      </GoogleMap>

      <button onClick={savePath} style={{ marginTop: '20px' }}>Save My Route</button>
    </div>
  );
};

export default Home;
