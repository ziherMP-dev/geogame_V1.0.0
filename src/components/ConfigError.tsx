import React from 'react';

export function ConfigError() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
        <p className="text-gray-700 mb-4">
          Google Maps API key is missing. Please follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Create a copy of .env.example as .env</li>
          <li>Get your Google Maps API key from the Google Cloud Console</li>
          <li>Replace 'your_api_key_here' with your actual API key in the .env file</li>
          <li>Restart the development server</li>
        </ol>
      </div>
    </div>
  );
}