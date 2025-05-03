import { EventEmitter } from 'events';

// We're using the fetch API which is available in both browser and Node.js environments
// This makes our code work in both client and server environments

// Define the frame interface
export interface StreamFrame {
  image: Buffer;
  metadata: 'safe' | 'danger' | 'unknown';
  timestamp: number;
}

// Define the stream listener options
export interface StreamListenerOptions {
  url: string;
  username?: string;
  password?: string;
  reconnectInterval?: number; // ms
}

/**
 * Creates and returns an event emitter that emits frames from an MJPEG stream
 * 
 * @param options Configuration options for the stream
 * @returns EventEmitter that emits 'frame' events with StreamFrame objects
 */
export function startStreamListener(options: StreamListenerOptions): EventEmitter {
  const emitter = new EventEmitter();
  const reconnectInterval = options.reconnectInterval || 5000; // Default 5 seconds
  
  let isConnected = false;
  let shouldReconnect = true;
  
  // Function to start the connection
  const connect = async () => {
    if (isConnected) return;
    
    try {
      isConnected = true;
      
      // Prepare the URL and authentication
      let url = options.url;
      let headers: HeadersInit = {};
      
      // Add authentication if provided and not already in URL
      if (options.username && options.password && !url.includes('@')) {
        const authString = btoa(`${options.username}:${options.password}`);
        headers['Authorization'] = `Basic ${authString}`;
      }
      
      console.log(`Connecting to stream: ${url}`);
      
      // Use fetch API which is available in both browser and Node.js environments
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('Response body is null');
      }
      
      // Get a reader from the response body
      const reader = response.body.getReader();
      
      // Buffer to accumulate data
      let buffer = Buffer.alloc(0);
      const frameBoundary = Buffer.from('--frame');
      
      // Process the stream
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          console.log('Stream complete');
          break;
        }
        
        if (!value || value.length === 0) continue;
        
        // Convert to Buffer and append to our buffer
        const chunk = Buffer.from(value);
        buffer = Buffer.concat([buffer, chunk]);
        
        // Process all complete frames in the buffer
        let boundaryIndex = buffer.indexOf(frameBoundary);
        
        while (boundaryIndex !== -1) {
          // If we found a frame boundary, process everything before it
          if (boundaryIndex > 0) {
            const framePart = buffer.slice(0, boundaryIndex);
            if (framePart.length > 0) {
              // Process the frame part
              const headerEndMarker = Buffer.from('\r\n\r\n');
              const headerEndIdx = framePart.indexOf(headerEndMarker);
              
              if (headerEndIdx !== -1) {
                // Extract headers
                const headerText = framePart.slice(0, headerEndIdx).toString('utf-8');
                
                // Check if this is an image frame
                if (headerText.includes('Content-Type: image/jpeg')) {
                  // Extract metadata
                  const metadataMatch = headerText.match(/Metadata:\s*([^\r\n]+)/);
                  const metadata = metadataMatch 
                    ? (metadataMatch[1].trim() as 'safe' | 'danger') 
                    : 'unknown';
                  
                  // Extract the image data
                  const imageData = framePart.slice(headerEndIdx + headerEndMarker.length);
                  
                  if (imageData.length > 0) {
                    // Emit the frame event
                    emitter.emit('frame', {
                      image: imageData,
                      metadata,
                      timestamp: Date.now()
                    });
                  }
                }
              }
            }
          }
          
          // Remove the processed part and the boundary from the buffer
          buffer = buffer.slice(boundaryIndex + frameBoundary.length);
          
          // Look for the next boundary
          boundaryIndex = buffer.indexOf(frameBoundary);
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Stream connection aborted');
      } else {
        console.error('Stream error:', error);
      }
      handleDisconnection();
    }
  };
  
  // This function is no longer used as we're processing frames directly
  // Keeping it for reference
  const _processBuffer = (buffer: Buffer): Buffer => {
    const frameBoundary = Buffer.from('--frame');
    const headerEndMarker = Buffer.from('\r\n\r\n');
    
    let startIdx = 0;
    let frameStartIdx = -1;
    
    // Find frame boundary
    frameStartIdx = buffer.indexOf(frameBoundary, startIdx);
    
    if (frameStartIdx === -1) {
      // No frame boundary found, keep the last 20 bytes in case they're part of a boundary
      return buffer.length > 20 ? buffer.slice(buffer.length - 20) : buffer;
    }
    
    // Find the header end marker
    const headerEndIdx = buffer.indexOf(headerEndMarker, frameStartIdx + frameBoundary.length);
    
    if (headerEndIdx === -1) {
      // Header end not found, keep everything from frame start
      return buffer.slice(frameStartIdx);
    }
    
    // Extract headers
    const headerText = buffer.slice(frameStartIdx + frameBoundary.length, headerEndIdx).toString('utf-8');
    
    // Find the next frame boundary (if any)
    const nextFrameIdx = buffer.indexOf(frameBoundary, headerEndIdx + headerEndMarker.length);
    
    // Extract image data
    const imageEndIdx = nextFrameIdx !== -1 ? nextFrameIdx : buffer.length;
    const imageData = buffer.slice(headerEndIdx + headerEndMarker.length, imageEndIdx);
    
    // Extract metadata
    const metadataMatch = headerText.match(/Metadata:\s*([^\r\n]+)/);
    const metadata = metadataMatch 
      ? (metadataMatch[1].trim() as 'safe' | 'danger') 
      : 'unknown';
    
    // Check if this is an image frame
    if (headerText.includes('Content-Type: image/jpeg') && imageData.length > 0) {
      // Emit the frame event
      emitter.emit('frame', {
        image: imageData,
        metadata,
        timestamp: Date.now()
      });
    }
    
    // Return the remaining buffer (from the next frame start or empty if no next frame)
    return nextFrameIdx !== -1 ? buffer.slice(nextFrameIdx) : Buffer.alloc(0);
  };
  
  // Handle disconnection and reconnection
  const handleDisconnection = () => {
    isConnected = false;
    
    if (shouldReconnect) {
      console.log(`Reconnecting in ${reconnectInterval}ms...`);
      setTimeout(connect, reconnectInterval);
    }
  };
  
  // Method to stop listening
  emitter.on('stopListening', () => {
    shouldReconnect = false;
    handleDisconnection();
  });
  
  // Start the initial connection
  connect();
  
  return emitter;
}

/**
 * Alternative implementation using an async generator
 * This allows consuming the stream using for-await-of syntax
 */
export async function* createStreamGenerator(options: StreamListenerOptions): AsyncGenerator<StreamFrame> {
  const emitter = startStreamListener(options);
  
  try {
    while (true) {
      // Create a promise that resolves on the next frame
      const frame = await new Promise<StreamFrame>((resolve) => {
        emitter.once('frame', resolve);
      });
      
      yield frame;
    }
  } finally {
    // Clean up when the generator is done
    emitter.emit('stopListening');
  }
}

/**
 * Client-side only function to create an image URL from a frame
 * This is useful for displaying the image in a Next.js component
 */
export function createImageUrl(frame: StreamFrame): string {
  if (typeof window === 'undefined') return '';
  
  // Create a blob from the image buffer
  const blob = new Blob([frame.image], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}

/**
 * Example usage with Next.js:
 * 
 * // In a React component (client-side only)
 * import { useEffect, useState } from 'react';
 * import { startStreamListener, StreamFrame, createImageUrl } from '@/server/actions/connection/streamListener';
 * 
 * export default function CameraStream() {
 *   const [imageUrl, setImageUrl] = useState<string>('');
 *   const [metadata, setMetadata] = useState<string>('unknown');
 * 
 *   useEffect(() => {
 *     // This must run only on the client side
 *     const streamEmitter = startStreamListener({
 *       url: 'http://81.218.244.80:5000/stream?url=http://192.168.90.59:5000/video',
 *       username: 'admin',
 *       password: '1234'
 *     });
 * 
 *     streamEmitter.on('frame', (frame: StreamFrame) => {
 *       setMetadata(frame.metadata);
 *       
 *       // Create a URL for the image
 *       const url = createImageUrl(frame);
 *       setImageUrl(url);
 *       
 *       // Clean up old URLs to prevent memory leaks
 *       return () => {
 *         if (imageUrl) URL.revokeObjectURL(imageUrl);
 *       };
 *     });
 * 
 *     return () => {
 *       streamEmitter.emit('stopListening');
 *     };
 *   }, []);
 * 
 *   return (
 *     <div>
 *       {imageUrl && <img src={imageUrl} alt="Camera stream" />}
 *       <div>Metadata: {metadata}</div>
 *     </div>
 *   );
 * }
 */
