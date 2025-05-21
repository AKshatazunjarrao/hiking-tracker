import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const defaultCenter = {
  lat: 19.076,
  lng: 72.8777,
};

const Home = () => {
  const [position, setPosition] = useState([]);
  const [userId, setUserId] = useState('');
  const [fromRef, setFromRef] = useState(null);
  const [toRef, setToRef] = useState(null);
  const [directions, setDirections] = useState(null);
  const [recentPaths, setRecentPaths] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDJ0-bNl92wveTAvX4FF5QgD9ZjqPjIvzw',
    libraries: ['places'],
  });

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

    fetchRecentPaths();

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchRecentPaths = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recent');
      setRecentPaths(res.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load recent paths:', error);
    }
  };

  const savePath = async () => {
    await axios.post('http://localhost:5000/api/save', {
      userId,
      path: position,
    });
    alert(`Path saved! Your User ID is: ${userId}`);
  };

  const handleRouteSearch = () => {
    if (!fromRef || !toRef) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: fromRef.getPlace().geometry.location,
        destination: toRef.getPlace().geometry.location,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          alert('Route not found');
        }
      }
    );
  };

  if (!isLoaded) return <div style={{ padding: 20 }}>Loading map...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.header}>🏞️ Track Your Hiking Route</h2>
      <p><strong>Your ID:</strong> <span style={styles.code}>{userId}</span></p>

      <div style={styles.searchContainer}>
        <Autocomplete onLoad={(ref) => setFromRef(ref)}>
          <input type="text" placeholder="From" style={styles.input} />
        </Autocomplete>
        <Autocomplete onLoad={(ref) => setToRef(ref)}>
          <input type="text" placeholder="To" style={styles.input} />
        </Autocomplete>
        <button onClick={handleRouteSearch} style={styles.button}>Show Route</button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position.length > 0 ? position[position.length - 1] : defaultCenter}
        zoom={15}
      >
        {position.length > 1 && (
          <Polyline
            path={position}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {position.length > 0 && (
          <Marker position={position[position.length - 1]} />
        )}

        {directions && <DirectionsRenderer directions={directions} />}

        {recentPaths.map((user, idx) => (
          <Polyline
            key={idx}
            path={user.path}
            options={{
              strokeColor: trailColors[idx % trailColors.length],
              strokeOpacity: 0.6,
              strokeWeight: 3,
            }}
          />
        ))}
      </GoogleMap>

      <button onClick={savePath} style={{ ...styles.button, marginTop: 20 }}>💾 Save My Route</button>
    </div>
  );
};

const trailColors = ['#4285F4', '#0F9D58', '#F4B400', '#DB4437', '#AB47BC'];

const styles = {
  page: {
    padding: '30px',
    maxWidth: '960px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  header: {
    fontSize: '1.8rem',
    marginBottom: '10px',
  },
  code: {
    backgroundColor: '#f4f4f4',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    width: '200px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#1976d2',
    color: 'white',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default Home;

