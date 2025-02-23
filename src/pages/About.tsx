import React from 'react';
import { Shield, Brain, Lock } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About TruthGuard AI</h1>
        <p className="text-xl text-gray-300">
          Empowering users to identify digital deception through advanced AI technology
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <Shield className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Our Mission</h2>
          <p className="text-gray-300">
            To combat the spread of misinformation by providing accessible tools for content verification.
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <Brain className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Technology</h2>
          <p className="text-gray-300">
            Powered by state-of-the-art AI models trained on extensive datasets of authentic and manipulated content.
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <Lock className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Privacy First</h2>
          <p className="text-gray-300">
            Your privacy is our priority. All content is analyzed securely and never stored permanently.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Deepfake Detection</h3>
            <p className="text-gray-300 mb-4">
              Our deepfake detection system analyzes videos frame by frame, looking for telltale signs of manipulation:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Facial inconsistencies and artifacts</li>
              <li>Unnatural movements and expressions</li>
              <li>Audio-visual synchronization issues</li>
              <li>Digital manipulation signatures</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-3">Fake News Detection</h3>
            <p className="text-gray-300 mb-4">
              Our text analysis system evaluates news articles and content using multiple factors:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Language patterns and writing style</li>
              <li>Source credibility indicators</li>
              <li>Content consistency analysis</li>
              <li>Cross-reference with known facts</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}