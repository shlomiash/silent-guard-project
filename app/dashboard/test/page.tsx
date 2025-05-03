'use client';
import React, { useState } from 'react';

const CameraPage: React.FC = () => {
  const [cameraUrl, setCameraUrl] = useState('http://192.168.90.59:5000');
  const [streamUrl, setStreamUrl] = useState('');

  const startStream = () => {
    if (!cameraUrl) {
      alert('אנא הזן כתובת URL של מצלמה');
      return;
    }
    const fullURL  = `http://admin:1234@81.218.244.80:5000/stream?url=${cameraUrl}/video`;
    const flaskServerUrl = 'http://admin:1234@81.218.244.80:5000/stream?url=http://192.168.90.59:5000/video'; // שרת ה-Flask שלך
    setStreamUrl(fullURL);
  };

  return (
    <div style={styles.container}>
      <h2>🎥 זרם וידאו ממצלמה</h2>

      <label htmlFor="cameraUrl">הכנס כתובת מצלמה:</label>
      <input
        id="cameraUrl"
        type="text"
        value={cameraUrl}
        onChange={(e) => setCameraUrl(e.target.value)}
        style={styles.input}
      />

      <button onClick={startStream} style={styles.button}>
        התחל סטרים
      </button>

      {streamUrl && (
        <img
          id="stream"
          src={streamUrl}
          alt="וידאו מהמצלמה"
          style={styles.stream}
        />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: 'black',
    color: 'white',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    minHeight: '100vh',
  },
  input: {
    fontSize: '1rem',
    padding: '8px',
    margin: '5px',
    width: '50%',
    direction: 'ltr',
  },
  button: {
    fontSize: '1rem',
    padding: '10px 20px',
    margin: '10px',
    cursor: 'pointer',
  },
  stream: {
    border: '3px solid white',
    marginTop: '20px',
    maxWidth: '90vw',
    maxHeight: '80vh',
  },
};

export default CameraPage;
