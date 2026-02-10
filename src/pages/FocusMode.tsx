import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Check, Flower2, Sun, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FlowerTimer from '@/components/FlowerTimer';
import SunTimer from '@/components/SunTimer';
import AmbientSounds from '@/components/AmbientSounds';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';
import { Task } from '@/components/TaskCard';

const FocusMode: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { completeTask } = usePoints();
  
  const task = location.state?.task as Task | undefined;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(task?.elapsedTime || 0);
  const [showAmbient, setShowAmbient] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSeconds = (task?.duration || 25) * 60;
  const progress = Math.min(elapsedTime / totalSeconds, 1);
  const remainingSeconds = Math.max(totalSeconds - elapsedTime, 0);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsDisplay = Math.floor(remainingSeconds % 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isCompleted && elapsedTime < totalSeconds) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          if (prev + 1 >= totalSeconds) {
            handleComplete();
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, elapsedTime, totalSeconds]);

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
    setIsCompleted(true);
    setShowConfetti(true);
    completeTask();
    setTimeout(() => setShowConfetti(false), 4000);
  }, [completeTask]);

  const handleReset = () => {
    setElapsedTime(0);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  const motivationalMessages = {
    ar: [
      'أنت تقوم بعمل رائع! 🌟',
      'استمر، النجاح قريب! 💪',
      'كل دقيقة تقربك من هدفك 🎯',
      'تركيزك مذهل! ✨',
    ],
    en: [
      "You're doing amazing! 🌟",
      'Keep going, success is near! 💪',
      'Every minute brings you closer 🎯',
      'Your focus is incredible! ✨',
    ],
  };

  const randomMessage = motivationalMessages[language][Math.floor(Math.random() * motivationalMessages[language].length)];

  if (!task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">
            {language === 'ar' ? 'لم يتم اختيار مهمة' : 'No task selected'}
          </p>
          <Link to="/app">
            <Button>
              <ArrowLeft className="w-4 h-4 me-2" />
              {language === 'ar' ? 'العودة للمهام' : 'Back to Tasks'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic Background based on progress */}
      <motion.div
        className="fixed inset-0 transition-all duration-1000"
        style={{
          background: task.visualType === 'sun'
            ? `linear-gradient(180deg, 
                hsl(${200 - progress * 180} 80% ${85 - progress * 45}%) 0%,
                hsl(${170 - progress * 150} 70% ${65 - progress * 40}%) 100%)`
            : `linear-gradient(180deg, 
                hsl(var(--background)) 0%,
                hsl(var(--primary) / 0.1) 100%)`,
        }}
      />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="fixed pointer-events-none z-50"
                initial={{
                  opacity: 1,
                  x: '50vw',
                  y: '50vh',
                  scale: 0,
                }}
                animate={{
                  opacity: [1, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, 1, 0.5],
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, delay: i * 0.03 }}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                  background: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bd6', '#ffa502'][i % 6],
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/app">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-xl font-bold">{task.title}</h1>
            <p className="text-sm text-muted-foreground">
              {task.visualType === 'flower' ? '🌸' : '☀️'} {t(task.category)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAmbient(!showAmbient)}
          >
            {showAmbient ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh]">
        {/* Timer Visual - Large */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 transform scale-125 md:scale-150"
        >
          {task.visualType === 'flower' ? (
            <FlowerTimer progress={progress} isActive={isPlaying} isPaused={!isPlaying && elapsedTime > 0} />
          ) : (
            <SunTimer progress={progress} isActive={isPlaying} />
          )}
        </motion.div>

        {/* Time Display */}
        <motion.div
          className="text-center mb-8"
          animate={isPlaying && remainingSeconds < 60 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <p className="text-7xl md:text-8xl font-bold  mb-2">
            {String(remainingMinutes).padStart(2, '0')}:{String(remainingSecondsDisplay).padStart(2, '0')}
          </p>
          <p className="text-muted-foreground">
            {isCompleted
              ? (language === 'ar' ? 'مكتملة! 🎉' : 'Completed! 🎉')
              : (language === 'ar' ? 'الوقت المتبقي' : 'Time Remaining')}
          </p>
        </motion.div>

        {/* Motivational Message */}
        {isPlaying && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg text-muted-foreground mb-8"
          >
            {randomMessage}
          </motion.p>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isCompleted ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="w-14 h-14 rounded-full"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>

              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full gradient-primary text-primary-foreground shadow-xl"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ms-1" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleComplete}
                className="w-14 h-14 rounded-full"
              >
                <Check className="w-6 h-6" />
              </Button>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-2xl font-bold text-primary mb-4">
                {language === 'ar' ? 'أحسنت!' : 'Well Done!'}
              </p>
              <p className="text-muted-foreground mb-6">
                +10 {t('points')} 🌟
              </p>
              <Link to="/app">
                <Button className="gradient-primary text-primary-foreground">
                  {language === 'ar' ? 'العودة للمهام' : 'Back to Tasks'}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Points indicator */}
        {!isCompleted && (
          <motion.p
            className="text-center text-sm text-muted-foreground mt-6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            +10 {t('points')} {language === 'ar' ? 'عند الإكمال' : 'on completion'} 🌟
          </motion.p>
        )}
      </main>

      {/* Ambient Sounds Panel */}
      <AnimatePresence>
        {showAmbient && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-20"
          >
            <AmbientSounds />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusMode;
