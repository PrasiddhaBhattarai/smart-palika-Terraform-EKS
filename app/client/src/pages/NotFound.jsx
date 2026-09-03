import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="bg-nepal-red p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="text-white w-10 h-10" />
        </div>
        
        <h1 className="text-6xl font-bold text-nepal-blue mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved. 
          Please check the URL or go back to the homepage.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/"
            className="bg-nepal-blue text-white px-6 py-3 rounded-lg hover:bg-blue-800 inline-flex items-center"
          >
            <FiHome className="mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;