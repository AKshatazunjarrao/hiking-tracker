// src/Search.js
/* import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [inputId, setInputId] = useState('');
  const [path, setPath] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/path/${inputId}`);
      setPath(res.data.path);
    } catch (error) {
      alert("Path not found or invalid User ID.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Hiking Route</h2>
      <input
        type="text"
        placeholder="Enter User ID"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        style={{ width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>

      {path.length > 1 && (
  <iframe
    title="map"
    width="100%"
    height="400"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
          src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyDJ0-bNl92wveTAvX4FF5QgD9ZjqPjIvzw&origin=${path[0].lat},${path[0].lng}&destination=${path[path.length - 1].lat},${path[path.length - 1].lng}&waypoints=${path.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|')}`}
        />
      )}
    </div>
  );
};

export default Search; */


// src/Search.js
import React, { useState } from 'react';
import axios from 'axios';
import { GoogleMap, Polyline, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = { lat: 20.5937, lng: 78.9629 }; // Default to India

const Search = () => {
  const [inputId, setInputId] = useState('');
  const [path, setPath] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDJ0-bNl92wveTAvX4FF5QgD9ZjqPjIvzw', // Replace here
  });

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/path/${inputId}`);
      setPath(res.data.path);
    } catch (error) {
      alert("Path not found or invalid User ID.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Hiking Route</h2>
      <input
        type="text"
        placeholder="Enter User ID"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        style={{ width: '300px' }}
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>

      {isLoaded && path.length > 0 && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={path[0] || center}
          zoom={15}
        >
          {/* Draw path */}
          <Polyline path={path} options={{ strokeColor: "#FF0000", strokeWeight: 4 }} />

          {/* Add markers */}
          {path.map((pos, idx) => (
            <Marker key={idx} position={pos} />
          ))}
        </GoogleMap>
      )}
    </div>
  );
};

export default Search;

