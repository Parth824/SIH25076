import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceMessageProps {
  duration: number;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // Simulate playback progress
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-3 py-2">
      <button
        onClick={togglePlayback}
        className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      
      <div className="flex-1">
        {/* Waveform visualization */}
        <div className="flex items-center space-x-1 mb-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-blue-400 rounded transition-all duration-100 ${
                i < (currentTime / duration) * 30 ? 'bg-blue-600' : 'bg-blue-200'
              }`}
              style={{
                height: `${Math.random() * 20 + 10}px`
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;