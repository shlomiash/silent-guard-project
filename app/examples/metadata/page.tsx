"use client";

import MetadataExample from "@/components/examples/metadata-example";

export default function MetadataExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Metadata Extractor Example</h1>
      
      <div className="grid gap-6">
        <MetadataExample 
          cameraUrl="http://192.168.90.59:5000/video"
          username="admin"
          password="1234"
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h2 className="text-lg font-semibold mb-2">How to Use the Metadata Extractor</h2>
        <pre className="bg-black text-white p-4 rounded-md overflow-x-auto">
{`// Import the metadata extractor
import { createMetadataExtractor, MetadataStatus } from "@/server/actions/connection/metadataExtractor";

// Create the metadata extractor
const metadataEmitter = createMetadataExtractor({
  url: "http://192.168.90.59:5000/video",
  username: "admin",
  password: "1234"
});

// Listen for metadata events
metadataEmitter.on("metadata", (status: MetadataStatus) => {
  console.log(\`Metadata status: \${status}\`);
  // Handle the metadata status: 'safe', 'danger', or 'unknown'
});

// To stop listening
metadataEmitter.stop();
`}
        </pre>
      </div>
    </div>
  );
}
