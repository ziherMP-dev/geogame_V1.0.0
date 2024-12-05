import React from 'react';

interface LoadingScreenProps {
  error?: Error;
}

export function LoadingScreen({ error }: LoadingScreenProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Google Maps</h1>
          <p className="text-gray-700">
            There was an error loading Google Maps. Please check your API key and make sure it has access to the required services:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Maps JavaScript API</li>
            <li>Street View API</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse text-xl text-gray-600">Loading...</div>
    </div>
  );
}