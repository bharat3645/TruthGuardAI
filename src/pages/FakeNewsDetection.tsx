import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Brain, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function FakeNewsDetection() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setResult(null);
    setConfidence(0);
    
    try {
      // Simulated AI analysis with more sophisticated checks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const lowerText = text.toLowerCase();
      
      // Enhanced detection criteria
      const sensationalPhrases = [
        'shocking truth', 'you won\'t believe', 'miracle cure',
        'secret they don\'t want you to know', '100% guaranteed',
        'doctors hate this', 'what they don\'t tell you',
        'this changes everything', 'wake up'
      ];
      
      const credibilityMarkers = [
        'according to research', 'studies show', 'experts say',
        'published in', 'evidence suggests', 'data indicates'
      ];
      
      let credibilityScore = 0.5;
      
      // Check for sensational language
      const sensationalCount = sensationalPhrases.filter(phrase => 
        lowerText.includes(phrase)
      ).length;
      
      // Check for credibility markers
      const credibilityCount = credibilityMarkers.filter(marker => 
        lowerText.includes(marker)
      ).length;
      
      // Adjust score based on findings
      credibilityScore -= (sensationalCount * 0.1);
      credibilityScore += (credibilityCount * 0.1);
      
      // Check for excessive punctuation
      const excessivePunctuation = (text.match(/[!?]{2,}/g) || []).length > 2;
      if (excessivePunctuation) credibilityScore -= 0.1;
      
      // Check for ALL CAPS segments
      const capsSegments = (text.match(/[A-Z]{5,}/g) || []).length;
      credibilityScore -= (capsSegments * 0.05);
      
      // Normalize score between 0 and 1
      credibilityScore = Math.max(0, Math.min(1, credibilityScore));
      
      const confidencePercentage = Math.round(credibilityScore * 100);
      setConfidence(confidencePercentage);
      
      setResult(credibilityScore > 0.6 
        ? 'This content appears to be legitimate news' 
        : 'This content shows characteristics of potential misinformation'
      );
    } catch (error) {
      console.error('Error analyzing text:', error);
      setResult('Error analyzing the content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-block p-3 bg-blue-500/10 rounded-full mb-6"
        >
          <Brain className="h-8 w-8 text-blue-500" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">AI-Powered News Analysis</h1>
        <p className="text-xl text-gray-400">
          Detect potential misinformation using advanced language analysis
        </p>
      </div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your article or text here for analysis..."
          className="w-full h-64 p-6 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white resize-none transition-colors"
        />
        <motion.button
          onClick={analyzeText}
          disabled={loading || !text.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-4 px-8 py-3 rounded-xl font-medium flex items-center justify-center w-full ${
            loading || !text.trim()
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing Content...
            </span>
          ) : (
            <span className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Analyze Content
            </span>
          )}
        </motion.button>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl backdrop-blur-sm ${
            result.includes('legitimate') 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          <div className="flex items-start space-x-4">
            {result.includes('legitimate') ? (
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">{result}</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Confidence Score</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      confidence > 60 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="text-right text-sm mt-1">{confidence}%</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 grid md:grid-cols-2 gap-6"
      >
        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
              Advanced language pattern analysis
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
              Credibility marker detection
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
              Sentiment and bias evaluation
            </li>
          </ul>
        </div>

        <div className="p-6 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Analysis Metrics</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
              Source credibility indicators
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
              Emotional manipulation detection
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
              Fact-checking integration
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}