"use client";

import { useState, useEffect } from "react";
import { createMetadataExtractor, formatCameraUrl, MetadataStatus } from "@/server/actions/connection/metadataExtractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

interface MetadataExampleProps {
  cameraUrl: string;
  username?: string;
  password?: string;
}

export default function MetadataExample({ cameraUrl, username, password }: MetadataExampleProps) {
  const [metadata, setMetadata] = useState<MetadataStatus>("unknown");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format the URL for direct use in an img tag
  const formattedUrl = formatCameraUrl(cameraUrl, username, password);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    let metadataEmitter: any = null;

    const initMetadataExtractor = async () => {
      setError(null);
      setIsConnected(false);

      try {
        // Create the metadata extractor
        metadataEmitter = createMetadataExtractor({
          url: cameraUrl,
          username,
          password
        });

        // Listen for metadata events
        metadataEmitter.on("metadata", (status: MetadataStatus) => {
          console.log(`Metadata status: ${status}`);
          setMetadata(status);
          setIsConnected(true);
        });

      } catch (err) {
        console.error("Failed to initialize metadata extractor:", err);
        setError("Failed to initialize metadata extractor");
        setIsConnected(false);
      }
    };

    initMetadataExtractor();

    // Cleanup function
    return () => {
      if (metadataEmitter) {
        metadataEmitter.stop();
        metadataEmitter.removeAllListeners();
      }
    };
  }, [cameraUrl, username, password]);

  // Get the appropriate icon based on metadata status
  const getStatusIcon = () => {
    switch (metadata) {
      case "safe":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "danger":
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      default:
        return <HelpCircle className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Camera Metadata Example</span>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
            <span className="text-sm font-normal">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
          {/* Display the camera stream */}
          <img 
            src={formattedUrl} 
            alt="Camera Stream" 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay for metadata status */}
          <div className="absolute bottom-3 right-3 bg-black/70 rounded-full p-2 flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-white font-medium capitalize">{metadata}</span>
          </div>
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
