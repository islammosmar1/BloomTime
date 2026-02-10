import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const messages = {
  ar: [
    'أنت تقوم بعمل رائع! استمر 🌟',
    'كل خطوة تقربك من هدفك 💪',
    'تذكر أن الراحة جزء من النجاح ☕',
    'ركز على التقدم لا الكمال 🌸',
    'أنت أقوى مما تعتقد! 🚀',
    'النجاح يأتي بالمثابرة 🏆',
  ],
  en: [
    "You're doing amazing! Keep it up 🌟",
    'Every step brings you closer 💪',
    'Remember, rest is part of success ☕',
    'Focus on progress, not perfection 🌸',
    "You're stronger than you think! 🚀",
    'Success comes with persistence 🏆',
  ],
};

const BreakReminder: React.FC = () => {
  const { language } = useLanguage();

  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const showReminder = () => {
      const list = messages[language];
      setText(list[Math.floor(Math.random() * list.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 8000);
    };

    const interval = setInterval(showReminder, 25 * 60 * 1000);

    return () => clearInterval(interval);
  }, [language]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4"
        >
          <div className="glass-card rounded-2xl p-4 shadow-2xl border border-primary/20">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center"
              >
                <Coffee className="w-5 h-5 text-primary" />
              </motion.div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {language === 'ar' ? 'وقت الراحة!' : 'Break Time!'}
                </p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setVisible(false)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreakReminder;
