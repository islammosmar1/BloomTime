import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Bird, Music, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';

interface SoundOption {
  id: string;
  icon: React.ReactNode;
  labelAr: string;
  labelEn: string;
  frequency: number;
  color: string;
}

const AmbientSounds: React.FC = () => {
  const { language } = useLanguage();

  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const sounds: SoundOption[] = [
    {
      id: 'rain',
      icon: <Cloud className="w-5 h-5" />,
      labelAr: 'مطر',
      labelEn: 'Rain',
      frequency: 200,
      color: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    },
    {
      id: 'wind',
      icon: <Wind className="w-5 h-5" />,
      labelAr: 'رياح',
      labelEn: 'Wind',
      frequency: 150,
      color: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
    },
    {
      id: 'birds',
      icon: <Bird className="w-5 h-5" />,
      labelAr: 'طيور',
      labelEn: 'Birds',
      frequency: 400,
      color: 'bg-green-500/20 text-green-500 border-green-500/30',
    },
    {
      id: 'music',
      icon: <Music className="w-5 h-5" />,
      labelAr: 'موسيقى',
      labelEn: 'Music',
      frequency: 261.63,
      color: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
    },
  ];

  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  const createContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current =
        new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playSound = (sound: SoundOption) => {
    oscillatorRef.current?.stop();

    const ctx = createContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = sound.id === 'music' ? 'sine' : 'triangle';
    oscillator.frequency.value = sound.frequency;

    gainNode.gain.value = (volume / 100) * 0.3;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    setActiveSound(sound.id);
    setIsPlaying(true);
  };

  const stopSound = () => {
    oscillatorRef.current?.stop();
    oscillatorRef.current = null;
    setActiveSound(null);
    setIsPlaying(false);
  };

  const toggleSound = (sound: SoundOption) => {
    activeSound === sound.id ? stopSound() : playSound(sound);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = (newVolume / 100) * 0.3;
    }
  };

  return (
    <div className="glass-card rounded-t-3xl p-6 border-t">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            {language === 'ar' ? 'أصوات الطبيعة' : 'Nature Sounds'}
          </h3>

          {isPlaying && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {sounds.map((sound) => (
            <motion.button
              key={sound.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSound(sound)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                activeSound === sound.id
                  ? `${sound.color} border-current shadow-lg`
                  : 'bg-muted/50 border-transparent hover:border-border'
              }`}
            >
              {sound.icon}
              <span className="text-xs font-medium">
                {language === 'ar' ? sound.labelAr : sound.labelEn}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{language === 'ar' ? 'مستوى الصوت' : 'Volume'}</span>
            <span>{volume}%</span>
          </div>

          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
          />
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          {language === 'ar'
            ? 'أصوات توليفية للاسترخاء والتركيز'
            : 'Synthetic ambient sounds for relaxation and focus'}
        </p>
      </div>
    </div>
  );
};

export default AmbientSounds;
