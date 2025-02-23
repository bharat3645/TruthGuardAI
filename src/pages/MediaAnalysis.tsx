import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileVideo, FileImage, FileAudio, Loader2 } from 'lucide-react';

type AnalysisResult = {
  confidence: number;
  authenticity: 'authentic' | 'synthetic';
  details: string[];
};

export function MediaAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'audio/*': ['.mp3', '.wav']
    },
    maxFiles: 1
  });

  const analyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      confidence: 87,
      authenticity: Math.random() > 0.5 ? 'authentic' : 'synthetic',
      details: [
        'Facial landmark consistency check passed',
        'Audio waveform analysis completed',
        'Metadata verification successful'
      ]
    });
    
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold">Media Analysis</h1>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Upload area */}
        <div
          {...getRootProps()}
          className={`
            p-12 rounded-2xl border-2 border-dashed transition-colors cursor-pointer
            ${isDragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-700 hover:border-gray-500'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload media for analysis'}
            </h3>
            <p className="text-gray-400 mb-4">
              Support for video, image, and audio files
            </p>
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <FileVideo className="w-6 h-6" />
              <FileImage className="w-6 h-6" />
              <FileAudio className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Preview and Analysis */}
        {file && (
          <div className="mt-8 space-y-6">
            {preview && (
              <div className="rounded-2xl overflow-hidden bg-gray-900">
                {file.type.startsWith('video/') ? (
                  <video src={preview} controls className="w-full" />
                ) : file.type.startsWith('image/') ? (
                  <img src={preview} alt="Preview" className="w-full" />
                ) : (
                  <div className="p-8 text-center">
                    <FileAudio className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">Audio file loaded</p>
                  </div>
                )}
              </div>
            )}

            {!analyzing && !result && (
              <button
                onClick={analyze}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
              >
                Analyze Media
              </button>
            )}

            {analyzing && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Analyzing your media...</p>
              </div>
            )}

            {result && (
              <div className={`p-6 rounded-xl ${
                result.authenticity === 'authentic' 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {result.authenticity === 'authentic' 
                      ? 'Content Appears Authentic' 
                      : 'Potential Synthetic Content Detected'
                    }
                  </h3>
                  <p className="text-gray-400">
                    Confidence: {result.confidence}%
                  </p>
                </div>

                <div className="space-y-2">
                  {result.details.map((detail, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/5">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}