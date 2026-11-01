import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { audioService } from '../utils/audio';
import { Language } from '../types';

interface AudioNarrationProps {
  textToRead: string;
  language: Language;
  speed?: number;
  autoPlay?: boolean;
}

export const AudioNarration: React.FC<AudioNarrationProps> = ({
  textToRead,
  language,
  speed = 1.0
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioService.stop();
    };
  }, []);

  const toggleSpeech = () => {
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioService.speak(textToRead, language, speed, () => {
        setIsPlaying(false);
      });
    }
  };

  const replay = () => {
    audioService.stop();
    setIsPlaying(true);
    audioService.speak(textToRead, language, speed, () => {
      setIsPlaying(false);
    });
  };

  return (
    <div className="inline-flex items-center gap-2 p-1.5 bg-amber-100/70 border border-amber-300/80 rounded-xl">
      <button
        onClick={toggleSpeech}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
          isPlaying
            ? 'bg-amber-600 text-white shadow-2xs'
            : 'bg-white text-amber-900 hover:bg-amber-50 shadow-2xs'
        }`}
        title={isPlaying ? 'Pause reading aloud' : 'Read aloud with Guruji voice'}
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span>Stop Audio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Listen to Guruji</span>
          </>
        )}
      </button>

      {isPlaying && (
        <span className="flex items-center gap-0.5 px-1.5">
          <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1 h-4 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1 h-2.5 bg-amber-600 rounded-full animate-bounce"></span>
        </span>
      )}

      <button
        onClick={replay}
        className="p-1 rounded-md text-amber-800 hover:bg-amber-200/70 transition"
        title="Replay from beginning"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};
