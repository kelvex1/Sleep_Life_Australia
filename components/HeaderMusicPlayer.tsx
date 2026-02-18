'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX, Play, Pause, Waves, Cloud, Radio, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type Track = {
  id: string;
  name: string;
  file: string;
  icon: typeof Waves;
};

const tracks: Track[] = [
  { id: 'ocean', name: 'Ocean Sounds', file: '/ocean-ambient.mp3', icon: Waves },
  { id: 'rain', name: 'Rain & Thunder', file: '/rain-thunder.mp3', icon: Cloud },
  { id: 'white-noise', name: 'White Noise', file: '/white-noise.mp3.mp3', icon: Radio },
  { id: 'pink-noise', name: 'Pink Noise', file: '/pink-noise.mp3', icon: Music },
];

export function HeaderMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState('ocean');
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const breathingTimerRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = tracks.find(t => t.id === currentTrackId)?.file || tracks[0].file;
      if (wasPlaying) {
        audioRef.current.play().catch(error => console.error('Track change failed:', error));
      }
    }
  }, [currentTrackId, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startBreathingCycle();
    } else {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    }
    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const startBreathingCycle = () => {
    const cycle = () => {
      setBreathingPhase('inhale');
      breathingTimerRef.current = setTimeout(() => {
        setBreathingPhase('hold');
        breathingTimerRef.current = setTimeout(() => {
          setBreathingPhase('exhale');
          breathingTimerRef.current = setTimeout(cycle, 8000);
        }, 7000);
      }, 4000);
    };
    cycle();
  };

  const handlePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          if (!audioRef.current.src || audioRef.current.src === '') {
            audioRef.current.src = tracks.find(t => t.id === currentTrackId)?.file || tracks[0].file;
          }
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Audio play failed - audio file may be missing. See public/AUDIO_SETUP_INSTRUCTIONS.txt for setup guidance.', error);
        }
      }
    }
  };


  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-90';
    }
  };

  if (!isMounted) return null;

  const modalContent = (
    <>
      {isExpanded && (
        <div className="fixed inset-0 z-[60] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 overflow-y-auto">
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 md:h-10 md:w-10 p-0 text-slate-700 hover:text-slate-900 hover:bg-slate-200 text-xl md:text-2xl rounded-full shadow-lg bg-white border-2 border-slate-300"
            >
              ×
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 md:py-16">
            <div className="w-full max-w-xl">
              <div className="text-center mb-4 md:mb-6">
                <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1.5 md:mb-2 flex items-center justify-center gap-2">
                  {(() => {
                    const CurrentIcon = tracks.find(t => t.id === currentTrackId)?.icon || Waves;
                    return <CurrentIcon className="w-6 h-6 md:w-7 md:h-7 text-cyan-600" />;
                  })()}
                  Sleep Sounds
                </h4>
                <p className="text-slate-600 text-sm md:text-base font-medium">Relaxing music for better rest</p>
              </div>

              {isPlaying && (
                <div className="mb-6 md:mb-8 flex justify-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br from-brand-blue-light to-brand-blue shadow-2xl shadow-brand-blue/40 transition-transform ${getBreathingScale()}`}
                      style={{
                        transition: breathingPhase === 'inhale' ? 'transform 4s ease-in-out' : breathingPhase === 'hold' ? 'transform 7s ease-in-out' : 'transform 8s ease-in-out'
                      }}
                    />
                    <div className="absolute inset-2 md:inset-3 rounded-full bg-white flex items-center justify-center shadow-inner">
                      <Waves className="w-10 h-10 md:w-14 md:h-14 text-cyan-600" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-5 md:mb-6">
                <p className="text-sm md:text-base text-slate-700 font-semibold mb-3 md:mb-4 text-center">Select Track</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto">
                  {tracks.map((track) => {
                    const TrackIcon = track.icon;
                    return (
                      <button
                        key={track.id}
                        onClick={() => setCurrentTrackId(track.id)}
                        className={`flex flex-col items-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all touch-manipulation shadow-lg ${
                          currentTrackId === track.id
                            ? "bg-gradient-to-br from-brand-blue-light to-brand-blue text-white shadow-2xl shadow-brand-blue/40 scale-105 border-2 border-brand-blue-light"
                            : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300 active:scale-95"
                        }`}
                      >
                        <TrackIcon className="w-8 h-8 md:w-10 md:h-10" />
                        <span className="text-xs md:text-sm font-bold text-center leading-tight">{track.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 max-w-md mx-auto">
                <div className="flex items-center gap-2 md:gap-3">
                  <Button
                    size="lg"
                    onClick={handlePlayPause}
                    className="flex-1 bg-brand-blue hover:bg-brand-blue-dark active:scale-95 text-white h-12 md:h-14 shadow-2xl shadow-brand-blue/40 text-base md:text-lg font-bold touch-manipulation border-2 border-brand-blue-light"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsMuted(!isMuted)}
                    className="border-2 border-slate-400 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 hover:text-slate-900 h-12 md:h-14 px-4 md:px-6 touch-manipulation shadow-lg"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
                  </Button>
                </div>

                <div className="flex items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg border-2 border-slate-300">
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-slate-600 flex-shrink-0" />
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(values) => {
                      const newVolume = values[0] / 100;
                      setVolume(newVolume);
                      if (newVolume > 0) setIsMuted(false);
                    }}
                    max={100}
                    step={1}
                    className="cursor-pointer flex-1 touch-manipulation"
                  />
                  <span className="text-sm md:text-base text-slate-700 w-10 md:w-12 text-right font-bold">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      />

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-brand-blue-light hover:text-brand-blue transition-colors relative"
        aria-label="Music player"
      >
        {isPlaying ? (
          <div className="relative">
            <Music className="w-5 h-5 md:w-7 md:h-7" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        ) : (
          <Music className="w-5 h-5 md:w-7 md:h-7" />
        )}
      </button>

      {isExpanded && createPortal(modalContent, document.body)}
    </>
  );
}
