import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ListTodo, CheckCircle2, Clock, BarChart3, Filter, SortAsc, Moon } from 'lucide-react';
import Header from '@/components/Header';
import TaskCard, { Task } from '@/components/TaskCard';
import AddTaskDialog from '@/components/AddTaskDialog';
import StatsPanel from '@/components/StatsPanel';
import EndOfDayReflection from '@/components/EndOfDayReflection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('bloomtime-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('tasks');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    localStorage.setItem('bloomtime-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = useCallback((newTask: Omit<Task, 'id' | 'status' | 'elapsedTime'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      status: 'pending',
      elapsedTime: 0,
    };
    setTasks(prev => [task, ...prev]);
  }, []);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
        case 'highPriority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default: // newest
          return parseInt(b.id) - parseInt(a.id);
      }
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'inProgress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" />
            {t('today')}
          </motion.div>
          
          {/* Stats */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <motion.div 
              className="glass-card rounded-2xl p-4 min-w-[90px]"
              whileHover={{ scale: 1.05 }}
            >
              <ListTodo className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">{t('pending')}</p>
            </motion.div>
            
            <motion.div 
              className="glass-card rounded-2xl p-4 min-w-[90px]"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">{t('inProgress')}</p>
            </motion.div>
            
            <motion.div 
              className="glass-card rounded-2xl p-4 min-w-[90px]"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">{t('completed')}</p>
            </motion.div>
          </div>

          <AddTaskDialog onAddTask={handleAddTask} />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              {t('tasks')}
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('stats')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            {/* Filters */}
            {tasks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-3 mb-6 justify-center"
              >
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] glass-card">
                    <Filter className="w-4 h-4 me-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="pending">{t('pending')}</SelectItem>
                    <SelectItem value="inProgress">{t('inProgress')}</SelectItem>
                    <SelectItem value="completed">{t('completed')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px] glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="study">📚 {t('study')}</SelectItem>
                    <SelectItem value="exercise">🏃 {t('exercise')}</SelectItem>
                    <SelectItem value="reading">📖 {t('reading')}</SelectItem>
                    <SelectItem value="other">✨ {t('other')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] glass-card">
                    <SortAsc className="w-4 h-4 me-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('newest')}</SelectItem>
                    <SelectItem value="oldest">{t('oldest')}</SelectItem>
                    <SelectItem value="highPriority">{t('highPriority')}</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  🌱
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                  {t('noTasks')}
                </h3>
                <p className="text-muted-foreground">{t('addFirstTask')}</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <div className="max-w-md mx-auto">
              <StatsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* End of Day Reflection Button */}
      <motion.div
        className="fixed bottom-6 end-6 z-40"
        whileHover={{ scale: 1.1 }}
      >
        <button
          onClick={() => setShowReflection(true)}
          className="w-12 h-12 rounded-full gradient-primary text-primary-foreground shadow-xl flex items-center justify-center"
        >
          <Moon className="w-5 h-5" />
        </button>
      </motion.div>

      <EndOfDayReflection isOpen={showReflection} onClose={() => setShowReflection(false)} />

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <svg 
          className="absolute bottom-0 w-full h-32" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120 Q360 60 720 90 Q1080 120 1440 60 L1440 120 Z" 
            fill="hsl(var(--primary) / 0.1)"
          />
        </svg>
      </div>
    </div>
  );
};

export default Index;
