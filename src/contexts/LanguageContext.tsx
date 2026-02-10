import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  ar: {
    // App branding
    appTitle: 'BloomTime',
    appSubtitle: 'نظم وقتك بطريقة ممتعة',
    
    // Navigation
    home: 'الرئيسية',
    tasks: 'المهام',
    stats: 'الإحصائيات',
    focusMode: 'وضع التركيز',
    
    // Task management
    addTask: 'إضافة مهمة',
    taskTitle: 'عنوان المهمة',
    taskDuration: 'المدة (بالدقائق)',
    taskCategory: 'التصنيف',
    study: 'دراسة',
    exercise: 'رياضة',
    reading: 'قراءة',
    other: 'أخرى',
    
    // Task actions
    start: 'ابدأ',
    pause: 'إيقاف',
    resume: 'استمرار',
    complete: 'إنهاء',
    delete: 'حذف',
    focus: 'تركيز',
    
    // Task states
    noTasks: 'لا توجد مهام بعد',
    addFirstTask: 'أضف مهمتك الأولى!',
    timeRemaining: 'الوقت المتبقي',
    minutes: 'دقيقة',
    completed: 'مكتملة',
    inProgress: 'قيد التنفيذ',
    pending: 'قادمة',
    
    // Visual options
    flower: 'الزهرة',
    sun: 'الشمس',
    chooseVisual: 'اختر التأثير البصري',
    
    // Settings
    settings: 'الإعدادات',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    language: 'اللغة',
    
    // Common
    today: 'مهام اليوم',
    progress: 'التقدم',
    cancel: 'إلغاء',
    save: 'حفظ',
    priority: 'الأولوية',
    notes: 'ملاحظات',
    optional: 'اختياري',
    
    // Gamification
    points: 'نقطة',
    level: 'المستوى',
    streak: 'أيام متتالية',
    tasksCompleted: 'مهمة مكتملة',
    dailyGoal: 'الهدف اليومي',
    goalAchieved: 'أحسنت! حققت هدفك اليومي',
    earnedBadges: 'الشارات المكتسبة',
    nextBadges: 'الشارات القادمة',
    
    // Filters
    all: 'الكل',
    filterByStatus: 'فلتر حسب الحالة',
    filterByCategory: 'فلتر حسب التصنيف',
    sortBy: 'ترتيب حسب',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    highPriority: 'الأولوية العالية',
    
    // Ambient sounds
    ambientSounds: 'أصوات الطبيعة',
    rain: 'مطر',
    wind: 'رياح',
    birds: 'طيور',
    
    // Calendar
    calendar: 'التقويم',
    noTasksForDay: 'لا توجد مهام في هذا اليوم',
    todayTasks: 'مهام اليوم',
    
    // Reflection
    endOfDayReflection: 'تأمل نهاية اليوم',
    howWasYourDay: 'كيف كان يومك؟',
    whatDidYouLearn: 'ماذا تعلمت اليوم؟',
    breakTime: 'وقت الراحة!',
    
    // Recurring
    recurring: 'متكرر',
    daily: 'يومي',
    weekly: 'أسبوعي',
    none: 'مرة واحدة',
    music: 'موسيقى',
    volume: 'مستوى الصوت',
    
    // Motivational
    greatJob: 'عمل رائع!',
    keepGoing: 'استمر!',
    almostThere: 'قاربت على الإنتهاء!',
    youDidIt: 'أحسنت!',
    
    // Unlockables
    unlockables: 'المفتوحات',
    flowerTypes: 'أنواع الزهور',
    backgrounds: 'الخلفيات',
    achievements: 'الإنجازات',
    locked: 'مقفل',
    unlocked: 'مفتوح',
  },
  en: {
    // App branding
    appTitle: 'BloomTime',
    appSubtitle: 'Organize your time in a fun way',
    
    // Navigation
    home: 'Home',
    tasks: 'Tasks',
    stats: 'Statistics',
    focusMode: 'Focus Mode',
    
    // Task management
    addTask: 'Add Task',
    taskTitle: 'Task Title',
    taskDuration: 'Duration (minutes)',
    taskCategory: 'Category',
    study: 'Study',
    exercise: 'Exercise',
    reading: 'Reading',
    other: 'Other',
    
    // Task actions
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    complete: 'Complete',
    delete: 'Delete',
    focus: 'Focus',
    
    // Task states
    noTasks: 'No tasks yet',
    addFirstTask: 'Add your first task!',
    timeRemaining: 'Time Remaining',
    minutes: 'minutes',
    completed: 'Completed',
    inProgress: 'In Progress',
    pending: 'Pending',
    
    // Visual options
    flower: 'Flower',
    sun: 'Sun',
    chooseVisual: 'Choose Visual Effect',
    
    // Settings
    settings: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    
    // Common
    today: "Today's Tasks",
    progress: 'Progress',
    cancel: 'Cancel',
    save: 'Save',
    priority: 'Priority',
    notes: 'Notes',
    optional: 'Optional',
    
    // Gamification
    points: 'points',
    level: 'Level',
    streak: 'Day Streak',
    tasksCompleted: 'Tasks Completed',
    dailyGoal: 'Daily Goal',
    goalAchieved: 'Great! You achieved your daily goal',
    earnedBadges: 'Earned Badges',
    nextBadges: 'Next Badges',
    
    // Filters
    all: 'All',
    filterByStatus: 'Filter by Status',
    filterByCategory: 'Filter by Category',
    sortBy: 'Sort by',
    newest: 'Newest',
    oldest: 'Oldest',
    highPriority: 'High Priority',
    
    // Ambient sounds
    ambientSounds: 'Nature Sounds',
    rain: 'Rain',
    wind: 'Wind',
    birds: 'Birds',
    
    // Calendar
    calendar: 'Calendar',
    noTasksForDay: 'No tasks for this day',
    todayTasks: "Today's Tasks",
    
    // Reflection
    endOfDayReflection: 'End of Day Reflection',
    howWasYourDay: 'How was your day?',
    whatDidYouLearn: 'What did you learn today?',
    breakTime: 'Break Time!',
    
    // Recurring
    recurring: 'Recurring',
    daily: 'Daily',
    weekly: 'Weekly',
    none: 'One-time',
    music: 'Music',
    volume: 'Volume',
    
    // Motivational
    greatJob: 'Great Job!',
    keepGoing: 'Keep Going!',
    almostThere: 'Almost There!',
    youDidIt: 'You Did It!',
    
    // Unlockables
    unlockables: 'Unlockables',
    flowerTypes: 'Flower Types',
    backgrounds: 'Backgrounds',
    achievements: 'Achievements',
    locked: 'Locked',
    unlocked: 'Unlocked',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('bloomtime-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('bloomtime-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
