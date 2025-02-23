import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ThreeScene } from '../components/ThreeScene';

export function Home() {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />
      
      {/* Three.js Scene */}
      <div className="absolute inset-0 -z-10">
        <ThreeScene />
      </div>
      
      {/* Main content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center backdrop-blur-sm bg-black/20">
          <div className="text-xl font-bold">TruthGuard</div>
          <Link 
            to="/analyze"
            className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          >
            Open App
          </Link>
        </header>

        {/* Hero section */}
        <div className="flex-1 flex items-center backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-20 w-full">
            <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Detect Digital Deception
            </h1>
            <p className="text-2xl text-gray-400 max-w-2xl mb-12">
              Advanced AI-powered detection of deepfakes and synthetic media. 
              Protect yourself from digital manipulation.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-medium transition-colors group"
            >
              Start Analysis
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div className="max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur">
            <div className="text-blue-500 text-4xl font-bold mb-4">01</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Detection</h3>
            <p className="text-gray-400">
              Instant analysis of images, videos, and audio for synthetic content markers.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur">
            <div className="text-blue-500 text-4xl font-bold mb-4">02</div>
            <h3 className="text-xl font-semibold mb-2">Multi-modal Analysis</h3>
            <p className="text-gray-400">
              Comprehensive examination across visual and audio components.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur">
            <div className="text-blue-500 text-4xl font-bold mb-4">03</div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-400">
              Your media is analyzed locally and never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}