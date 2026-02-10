import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';

interface EndOfDayReflectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const EndOfDayReflection: React.FC<EndOfDayReflectionProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { stats } = usePoints();

  const [mood, setMood] = useState(3);
  const [text, setText] = useState('');

  const moods = ['😔', '😐', '🙂', '😊', '🤩'];

  const saveReflection = () => {
    const data = JSON.parse(
      localStorage.getItem('bloomtime-reflections') || '[]'
    );

    data.push({
      date: new Date().toISOString(),
      mood,
      text,
      tasksCompleted: stats.todayCompleted,
    });

    localStorage.setItem('bloomtime-reflections', JSON.stringify(data));

    setMood(3);
    setText('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md"
          >
            <Card className="glass-card shadow-2xl border border-primary/15">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">
                      {language === 'ar'
                        ? 'تأمل نهاية اليوم'
                        : 'End of Day Reflection'}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center mb-6 p-4 rounded-xl bg-primary/8">
                  <p className="text-3xl font-bold text-primary">
                    {stats.todayCompleted}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar'
                      ? 'مهام أكملتها اليوم'
                      : 'tasks completed today'}
                  </p>
                  {stats.currentStreak > 0 && (
                    <p className="text-xs text-accent mt-1">
                      🔥 {stats.currentStreak}{' '}
                      {language === 'ar' ? 'يوم متتالي' : 'day streak'}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-center mb-3">
                    {language === 'ar'
                      ? 'كيف كان يومك؟'
                      : 'How was your day?'}
                  </p>
                  <div className="flex justify-center gap-3">
                    {moods.map((emoji, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setMood(index + 1)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className={`text-3xl p-2 rounded-xl transition-all ${
                          mood === index + 1
                            ? 'bg-primary/15 ring-2 ring-primary shadow-md'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    className="resize-none"
                    placeholder={
                      language === 'ar'
                        ? 'ماذا تعلمت اليوم؟ ما الذي يمكن تحسينه؟'
                        : 'What did you learn today? What can be improved?'
                    }
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    {language === 'ar' ? 'لاحقاً' : 'Later'}
                  </Button>
                  <Button
                    className="flex-1 gradient-primary text-primary-foreground"
                    onClick={saveReflection}
                  >
                    <Send className="w-4 h-4 me-2" />
                    {language === 'ar' ? 'حفظ' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EndOfDayReflection;
