import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flower2, Sun, Flag, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Task } from './TaskCard';

interface AddTaskDialogProps {
  onAddTask: (task: Omit<Task, 'id' | 'status' | 'elapsedTime'>) => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ onAddTask }) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(25);
  const [category, setCategory] = useState<Task['category']>('study');
  const [visualType, setVisualType] = useState<Task['visualType']>('flower');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly'>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      duration,
      category,
      visualType,
      priority,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setDuration(25);
    setCategory('study');
    setVisualType('flower');
    setPriority('medium');
    setNotes('');
    setRecurring('none');
    setOpen(false);
  };

  const priorityOptions = [
    { value: 'low', label: { ar: 'منخفضة 🟢', en: 'Low 🟢' }, color: 'text-green-500' },
    { value: 'medium', label: { ar: 'متوسطة 🟡', en: 'Medium 🟡' }, color: 'text-yellow-500' },
    { value: 'high', label: { ar: 'عالية 🔴', en: 'High 🔴' }, color: 'text-red-500' },
  ];

  const quickDurations = [15, 25, 30, 45, 60];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all text-lg px-6 py-6">
          <Plus className="w-5 h-5 me-2" />
          {t('addTask')}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold ">
            {t('addTask')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('taskTitle')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: مراجعة الرياضيات' : 'e.g., Review math chapter'}
              className="bg-background text-lg"
              required
            />
          </div>

          {/* Duration with quick options */}
          <div className="space-y-2">
            <Label>{t('taskDuration')}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {quickDurations.map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={duration === d ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDuration(d)}
                  className={duration === d ? 'gradient-primary text-primary-foreground' : ''}
                >
                  {d} {language === 'ar' ? 'د' : 'm'}
                </Button>
              ))}
            </div>
            <Input
              id="duration"
              type="number"
              min={1}
              max={180}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-background"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{t('taskCategory')}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Task['category'])}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">📚 {t('study')}</SelectItem>
                <SelectItem value="exercise">🏃 {t('exercise')}</SelectItem>
                <SelectItem value="reading">📖 {t('reading')}</SelectItem>
                <SelectItem value="other">✨ {t('other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              {t('priority') || 'الأولوية'}
            </Label>
            <div className="flex gap-2">
              {priorityOptions.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={priority === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority(opt.value as Task['priority'])}
                  className={`flex-1 ${priority === opt.value ? 'gradient-primary text-primary-foreground' : ''}`}
                >
                  {language === 'ar' ? opt.label.ar : opt.label.en}
                </Button>
              ))}
            </div>
          </div>

          {/* Visual Type */}
          <div className="space-y-2">
            <Label>{t('chooseVisual')}</Label>
            <div className="flex gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisualType('flower')}
                className={`flex-1 p-5 rounded-2xl border-2 transition-all ${
                  visualType === 'flower'
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="text-4xl mb-2">🌸</div>
                <Flower2 className={`w-6 h-6 mx-auto mb-1 ${
                  visualType === 'flower' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className={`text-sm font-medium ${
                  visualType === 'flower' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {t('flower')}
                </p>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisualType('sun')}
                className={`flex-1 p-5 rounded-2xl border-2 transition-all ${
                  visualType === 'sun'
                    ? 'border-accent bg-accent/10 shadow-lg'
                    : 'border-border bg-background hover:border-accent/50'
                }`}
              >
                <div className="text-4xl mb-2">☀️</div>
                <Sun className={`w-6 h-6 mx-auto mb-1 ${
                  visualType === 'sun' ? 'text-accent' : 'text-muted-foreground'
                }`} />
                <p className={`text-sm font-medium ${
                  visualType === 'sun' ? 'text-accent' : 'text-muted-foreground'
                }`}>
                  {t('sun')}
                </p>
              </motion.button>
            </div>
          </div>

          {/* Recurring */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              {t('recurring')}
            </Label>
            <div className="flex gap-2">
              {(['none', 'daily', 'weekly'] as const).map((opt) => (
                <Button
                  key={opt}
                  type="button"
                  variant={recurring === opt ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRecurring(opt)}
                  className={`flex-1 ${recurring === opt ? 'gradient-primary text-primary-foreground' : ''}`}
                >
                  {t(opt)}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('notes')} ({t('optional')})</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ar' ? 'أضف ملاحظات للمهمة...' : 'Add notes for this task...'}
              className="bg-background resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1 gradient-primary text-primary-foreground">
              {t('save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
