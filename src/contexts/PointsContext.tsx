import React, { createContext, useContext, useState, useEffect } from 'react';

interface Badge {
  id: string;
  name: { ar: string; en: string };
  icon: string;
  description: { ar: string; en: string };
  requirement: number;
  type: 'tasks' | 'streak' | 'points';
}

interface UserStats {
  totalPoints: number;
  level: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  earnedBadges: string[];
  dailyGoal: number;
  todayCompleted: number;
}

interface PointsContextType {
  stats: UserStats;
  addPoints: (points: number) => void;
  completeTask: () => void;
  badges: Badge[];
  getLevel: (points: number) => { level: number; title: { ar: string; en: string }; progress: number };
  resetDailyProgress: () => void;
  setDailyGoal: (goal: number) => void;
}

const badges: Badge[] = [
  { id: 'first_task', name: { ar: 'البداية', en: 'First Step' }, icon: '🌱', description: { ar: 'أكمل أول مهمة', en: 'Complete first task' }, requirement: 1, type: 'tasks' },
  { id: 'five_tasks', name: { ar: 'المثابر', en: 'Persistent' }, icon: '⭐', description: { ar: 'أكمل 5 مهام', en: 'Complete 5 tasks' }, requirement: 5, type: 'tasks' },
  { id: 'ten_tasks', name: { ar: 'المجتهد', en: 'Hardworking' }, icon: '🌟', description: { ar: 'أكمل 10 مهام', en: 'Complete 10 tasks' }, requirement: 10, type: 'tasks' },
  { id: 'fifty_tasks', name: { ar: 'البطل', en: 'Champion' }, icon: '🏆', description: { ar: 'أكمل 50 مهمة', en: 'Complete 50 tasks' }, requirement: 50, type: 'tasks' },
  { id: 'hundred_tasks', name: { ar: 'الأسطورة', en: 'Legend' }, icon: '👑', description: { ar: 'أكمل 100 مهمة', en: 'Complete 100 tasks' }, requirement: 100, type: 'tasks' },
  { id: 'streak_3', name: { ar: 'متواصل', en: 'Consistent' }, icon: '🔥', description: { ar: '3 أيام متتالية', en: '3 day streak' }, requirement: 3, type: 'streak' },
  { id: 'streak_7', name: { ar: 'ملتزم', en: 'Committed' }, icon: '💪', description: { ar: '7 أيام متتالية', en: '7 day streak' }, requirement: 7, type: 'streak' },
  { id: 'streak_30', name: { ar: 'خارق', en: 'Unstoppable' }, icon: '🚀', description: { ar: '30 يوم متتالي', en: '30 day streak' }, requirement: 30, type: 'streak' },
  { id: 'points_100', name: { ar: 'جامع النقاط', en: 'Point Collector' }, icon: '💎', description: { ar: 'اجمع 100 نقطة', en: 'Collect 100 points' }, requirement: 100, type: 'points' },
  { id: 'points_500', name: { ar: 'ثري النقاط', en: 'Point Master' }, icon: '💰', description: { ar: 'اجمع 500 نقطة', en: 'Collect 500 points' }, requirement: 500, type: 'points' },
];

const levels = [
  { min: 0, title: { ar: 'مبتدئ', en: 'Beginner' } },
  { min: 50, title: { ar: 'متعلم', en: 'Learner' } },
  { min: 150, title: { ar: 'متقدم', en: 'Advanced' } },
  { min: 300, title: { ar: 'خبير', en: 'Expert' } },
  { min: 500, title: { ar: 'محترف', en: 'Professional' } },
  { min: 800, title: { ar: 'أستاذ', en: 'Master' } },
  { min: 1200, title: { ar: 'عبقري', en: 'Genius' } },
  { min: 2000, title: { ar: 'أسطورة', en: 'Legend' } },
];

const PointsContext = createContext<PointsContextType | undefined>(undefined);

const defaultStats: UserStats = {
  totalPoints: 0,
  level: 1,
  tasksCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  earnedBadges: [],
  dailyGoal: 3,
  todayCompleted: 0,
};

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('student-points');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if it's a new day
      const today = new Date().toDateString();
      if (parsed.lastCompletedDate !== today) {
        return { ...parsed, todayCompleted: 0 };
      }
      return parsed;
    }
    return defaultStats;
  });

  useEffect(() => {
    localStorage.setItem('student-points', JSON.stringify(stats));
  }, [stats]);

  const getLevel = (points: number) => {
    let currentLevel = 1;
    let currentTitle = levels[0].title;
    let nextLevelPoints = levels[1]?.min || 50;
    let currentLevelPoints = 0;

    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].min) {
        currentLevel = i + 1;
        currentTitle = levels[i].title;
        currentLevelPoints = levels[i].min;
        nextLevelPoints = levels[i + 1]?.min || levels[i].min + 500;
        break;
      }
    }

    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

    return { level: currentLevel, title: currentTitle, progress: Math.min(progress, 100) };
  };

  const checkBadges = (newStats: UserStats): string[] => {
    const newBadges: string[] = [];

    badges.forEach(badge => {
      if (newStats.earnedBadges.includes(badge.id)) return;

      let earned = false;
      switch (badge.type) {
        case 'tasks':
          earned = newStats.tasksCompleted >= badge.requirement;
          break;
        case 'streak':
          earned = newStats.currentStreak >= badge.requirement;
          break;
        case 'points':
          earned = newStats.totalPoints >= badge.requirement;
          break;
      }

      if (earned) newBadges.push(badge.id);
    });

    return newBadges;
  };

  const addPoints = (points: number) => {
    setStats(prev => {
      const newStats = { ...prev, totalPoints: prev.totalPoints + points };
      const newBadges = checkBadges(newStats);
      return { ...newStats, earnedBadges: [...prev.earnedBadges, ...newBadges] };
    });
  };

  const completeTask = () => {
    const today = new Date().toDateString();
    
    setStats(prev => {
      const isNewDay = prev.lastCompletedDate !== today;
      const wasYesterday = prev.lastCompletedDate === new Date(Date.now() - 86400000).toDateString();
      
      let newStreak = prev.currentStreak;
      if (isNewDay) {
        newStreak = wasYesterday ? prev.currentStreak + 1 : 1;
      }

      const newStats: UserStats = {
        ...prev,
        totalPoints: prev.totalPoints + 10,
        tasksCompleted: prev.tasksCompleted + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastCompletedDate: today,
        todayCompleted: prev.todayCompleted + 1,
      };

      const newBadges = checkBadges(newStats);
      return { ...newStats, earnedBadges: [...prev.earnedBadges, ...newBadges] };
    });
  };

  const resetDailyProgress = () => {
    setStats(prev => ({ ...prev, todayCompleted: 0 }));
  };

  const setDailyGoal = (goal: number) => {
    setStats(prev => ({ ...prev, dailyGoal: goal }));
  };

  return (
    <PointsContext.Provider value={{ stats, addPoints, completeTask, badges, getLevel, resetDailyProgress, setDailyGoal }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
