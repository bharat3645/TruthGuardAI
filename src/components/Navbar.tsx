import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Brain, FileVideo, Newspaper } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700';
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">TruthGuard AI</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              <Brain className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/deepfake"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${isActive('/deepfake')}`}
            >
              <FileVideo className="h-4 w-4" />
              <span>Deepfake Detection</span>
            </Link>
            
            <Link
              to="/fakenews"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${isActive('/fakenews')}`}
            >
              <Newspaper className="h-4 w-4" />
              <span>Fake News Detection</span>
            </Link>
            
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about')}`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}