import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Clock, Flower2, Sun, Target } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Task } from '@/components/TaskCard';
import AddTaskDialog from '@/components/AddTaskDialog';
import { useNavigate } from 'react-router-dom';

const Calendar: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const tasks: Task[] = useMemo(() => {
    const saved = localStorage.getItem('bloomtime-tasks');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const locale = language === 'ar' ? ar : enUS;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale });
  const calendarEnd = endOfWeek(monthEnd, { locale });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = language === 'ar'
    ? ['أحد', 'إثن', 'ثلث', 'أربع', 'خمس', 'جمع', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Group tasks by creation date (using id as timestamp)
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(parseInt(task.id));
      return isSameDay(taskDate, date);
    });
  };

  const selectedDayTasks = getTasksForDate(selectedDate);

  const handleAddTask = (newTask: Omit<Task, 'id' | 'status' | 'elapsedTime'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      status: 'pending',
      elapsedTime: 0,
    };
    const allTasks = [...tasks, task];
    localStorage.setItem('bloomtime-tasks', JSON.stringify(allTasks));
    window.location.reload();
  };

  const getTaskIndicators = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return null;
    const completed = dayTasks.filter(t => t.status === 'completed').length;
    const inProgress = dayTasks.filter(t => t.status === 'inProgress').length;
    const pending = dayTasks.filter(t => t.status === 'pending').length;
    return { total: dayTasks.length, completed, inProgress, pending };
  };

  const statusColors = {
    completed: 'bg-primary',
    inProgress: 'bg-accent',
    pending: 'bg-muted-foreground/40',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Month Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold ">
            {format(currentMonth, 'MMMM yyyy', { locale })}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-4">
              {/* Week day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const indicators = getTaskIndicators(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isDayToday = isToday(day);

                  return (
                    <motion.button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-sm ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : isDayToday
                          ? 'bg-primary/15 text-primary font-bold'
                          : isCurrentMonth
                          ? 'hover:bg-muted/80 text-foreground'
                          : 'text-muted-foreground/40'
                      }`}
                    >
                      <span className={`${isDayToday && !isSelected ? 'font-bold' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      {indicators && (
                        <div className="flex gap-0.5">
                          {indicators.completed > 0 && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground' : statusColors.completed}`} />
                          )}
                          {indicators.inProgress > 0 && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground/70' : statusColors.inProgress}`} />
                          )}
                          {indicators.pending > 0 && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground/50' : statusColors.pending}`} />
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Day Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {isToday(selectedDate)
                ? (language === 'ar' ? 'مهام اليوم' : "Today's Tasks")
                : format(selectedDate, 'EEEE, d MMMM', { locale })}
            </h3>
            <AddTaskDialog onAddTask={handleAddTask} />
          </div>

          <AnimatePresence mode="popLayout">
            {selectedDayTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  📅
                </motion.div>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'لا توجد مهام في هذا اليوم' : 'No tasks for this day'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {selectedDayTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                  >
                    <Card className={`glass-card transition-all ${
                      task.status === 'completed' ? 'opacity-70' : ''
                    } ${task.status === 'inProgress' ? 'ring-1 ring-primary' : ''}`}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-2xl">
                          {task.visualType === 'flower' ? '🌸' : '☀️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium truncate ${
                            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.duration} {language === 'ar' ? 'د' : 'min'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              task.status === 'completed' ? 'bg-primary/15 text-primary' :
                              task.status === 'inProgress' ? 'bg-accent/15 text-accent-foreground' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {t(task.status)}
                            </span>
                          </div>
                        </div>
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate('/focus', { state: { task } })}
                          >
                            <Target className="w-4 h-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            {t('completed')}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent" />
            {t('inProgress')}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
            {t('pending')}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
