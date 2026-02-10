import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Check,
  Trash2,
  Flower2,
  Sun,
  Flag,
  StickyNote,
  ChevronDown,
  ChevronUp,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FlowerTimer from './FlowerTimer';
import SunTimer from './SunTimer';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';

export interface Task {
  id: string;
  title: string;
  duration: number;
  category: 'study' | 'exercise' | 'reading' | 'other';
  visualType: 'flower' | 'sun';
  status: 'pending' | 'inProgress' | 'completed';
  elapsedTime: number;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  study: '📚',
  exercise: '🏃',
  reading: '📖',
  other: '✨',
};

const priorityColors = {
  low: 'bg-primary/20 text-primary border-primary/30',
  medium: 'bg-accent/20 text-accent-foreground border-accent/30',
  high: 'bg-destructive/20 text-destructive border-destructive/30',
};

const priorityLabels = {
  low: { ar: 'منخفضة', en: 'Low' },
  medium: { ar: 'متوسطة', en: 'Medium' },
  high: { ar: 'عالية', en: 'High' },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const { t, language } = useLanguage();
  const { completeTask } = usePoints();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(task.status === 'inProgress');
  const [showNotes, setShowNotes] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalSeconds = task.duration * 60;
  const progress = Math.min(task.elapsedTime / totalSeconds, 1);
  const remainingSeconds = Math.max(totalSeconds - task.elapsedTime, 0);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

  useEffect(() => {
    if (!isActive || task.status !== 'inProgress') return;

    const interval = setInterval(() => {
      const next = task.elapsedTime + 1;

      if (next >= totalSeconds) {
        handleAutoComplete();
      } else {
        onUpdate({ ...task, elapsedTime: next });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, task]);

  const handleAutoComplete = useCallback(() => {
    setIsActive(false);
    setShowConfetti(true);
    completeTask();
    onUpdate({ ...task, status: 'completed', elapsedTime: totalSeconds });
    setTimeout(() => setShowConfetti(false), 3000);
  }, [task]);

  const handleStart = () => {
    setIsActive(true);
    onUpdate({ ...task, status: 'inProgress' });
  };

  const handlePause = () => setIsActive(false);
  const handleResume = () => setIsActive(true);

  const handleComplete = () => {
    setIsActive(false);
    setShowConfetti(true);
    completeTask();
    onUpdate({ ...task, status: 'completed', elapsedTime: totalSeconds });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleFocusMode = () => {
    navigate('/focus', { state: { task } });
  };

  const isCompleted = task.status === 'completed';
  const isPaused = task.status === 'inProgress' && !isActive;

  const confettiColors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(142 50% 50%)',
    'hsl(340 65% 65%)',
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout>
      <AnimatePresence>
        {showConfetti &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute z-50"
              initial={{ opacity: 1, x: '50%', y: '50%', scale: 0 }}
              animate={{
                opacity: [1, 1, 0],
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${-50 + Math.random() * 100}%`,
                scale: [0, 1, 0.5],
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
              style={{
                width: 12,
                height: 12,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: confettiColors[i % confettiColors.length],
              }}
            />
          ))}
      </AnimatePresence>

      <Card className={`glass-card ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <CardContent className="p-5">
          <div className="flex justify-between mb-4">
            <div className="flex gap-3">
              <span className="text-3xl">{categoryIcons[task.category]}</span>
              <div>
                <h3 className={`font-semibold ${isCompleted ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs flex items-center gap-1">
                    {task.visualType === 'flower' ? <Flower2 size={12} /> : <Sun size={12} />}
                    {t(task.category)}
                  </span>
                  <span className={`text-xs px-2 rounded-full border ${priorityColors[task.priority]}`}>
                    <Flag size={12} className="inline me-1" />
                    {language === 'ar'
                      ? priorityLabels[task.priority].ar
                      : priorityLabels[task.priority].en}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
              <Trash2 size={16} />
            </Button>
          </div>

          {task.notes && (
            <>
              <button onClick={() => setShowNotes(!showNotes)} className="flex gap-2 text-sm">
                <StickyNote size={14} />
                {t('notes')}
                {showNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showNotes && <p className="mt-2 p-3 bg-muted/50 rounded">{task.notes}</p>}
            </>
          )}

          <div className="my-6">
            {task.visualType === 'flower' ? (
              <FlowerTimer progress={progress} isActive={isActive} isPaused={isPaused} />
            ) : (
              <SunTimer progress={progress} isActive={isActive} />
            )}
          </div>

          <div className="text-center mb-4">
            <p className="text-sm">{t('timeRemaining')}</p>
            <p className="text-4xl font-bold">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-xs">+10 {t('points')} 🌟</p>
          </div>

          <div className="flex justify-center gap-2">
            {task.status === 'pending' && (
              <>
                <Button onClick={handleStart}>
                  <Play size={16} /> {t('start')}
                </Button>
                <Button variant="outline" onClick={handleFocusMode}>
                  <Target size={16} /> {t('focus')}
                </Button>
              </>
            )}

            {task.status === 'inProgress' && !isCompleted && (
              <>
                {isActive ? (
                  <Button onClick={handlePause}>
                    <Pause size={16} /> {t('pause')}
                  </Button>
                ) : (
                  <Button onClick={handleResume}>
                    <Play size={16} /> {t('resume')}
                  </Button>
                )}
                <Button variant="outline" onClick={handleComplete}>
                  <Check size={16} /> {t('complete')}
                </Button>
              </>
            )}

            {isCompleted && (
              <div className="flex items-center gap-2 text-primary">
                <Check size={20} /> {t('completed')} 🎉
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
