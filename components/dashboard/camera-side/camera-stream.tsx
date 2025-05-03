'use client';

import { useEffect, useState, useRef } from 'react';
import { startStreamListener, StreamFrame, createImageUrl } from '@/server/actions/connection/streamListener';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface CameraStreamProps {
  cameraUrl: string;
  username?: string;
  password?: string;
  onMetadataChange?: (metadata: 'safe' | 'danger' | 'unknown') => void;
}

export default function CameraStream({ 
  cameraUrl, 
  username = 'admin', 
  password = '1234',
  onMetadataChange 
}: CameraStreamProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<'safe' | 'danger' | 'unknown'>('unknown');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevImageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    setIsConnected(true);
    setError(null);

    try {
      // Construct the stream URL
      const streamUrl = `http://81.218.244.80:5000/stream?url=${encodeURIComponent(cameraUrl)}`;
      
      // Create the stream listener
      const streamEmitter = startStreamListener({
        url: streamUrl,
        username,
        password
      });

      // Handle incoming frames
      streamEmitter.on('frame', (frame: StreamFrame) => {
        // Update metadata state and call the callback if provided
        setMetadata(frame.metadata);
        if (onMetadataChange) {
          onMetadataChange(frame.metadata);
        }
        
        // Clean up previous image URL to prevent memory leaks
        if (prevImageUrlRef.current) {
          URL.revokeObjectURL(prevImageUrlRef.current);
        }
        
        // Create a new image URL from the frame
        const url = createImageUrl(frame);
        setImageUrl(url);
        prevImageUrlRef.current = url;
      });

      // Handle errors
      streamEmitter.on('error', (err: Error) => {
        console.error('Stream error:', err);
        setError('Failed to connect to camera stream');
        setIsConnected(false);
      });

      // Cleanup function
      return () => {
        streamEmitter.emit('stopListening');
        if (prevImageUrlRef.current) {
          URL.revokeObjectURL(prevImageUrlRef.current);
        }
      };
    } catch (error) {
      console.error('Failed to initialize stream:', error);
      setError('Failed to initialize camera stream');
      setIsConnected(false);
    }
  }, [cameraUrl, username, password, onMetadataChange]);

  return (
    <Card className="relative overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
          <div className="text-center p-4">
            <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-red-500" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {!isConnected && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
          <div className="text-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 rounded-full mx-auto mb-2" />
            <p>Connecting to camera...</p>
          </div>
        </div>
      )}
      
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Camera stream" 
            className="w-full h-auto"
          />
          <div className={`absolute bottom-0 left-0 right-0 p-2 text-white text-sm font-medium
            ${metadata === 'danger' ? 'bg-red-600' : 
              metadata === 'safe' ? 'bg-green-600' : 'bg-gray-600'}`}>
            Status: {metadata.toUpperCase()}
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-900 flex items-center justify-center text-gray-400">
          <p>Waiting for video stream...</p>
        </div>
      )}
    </Card>
  );
}
