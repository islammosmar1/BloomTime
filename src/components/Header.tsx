import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Languages, Flower2, Calendar, Home, ListTodo, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { stats, getLevel } = usePoints();
  const levelInfo = getLevel(stats.totalPoints);
  const location = useLocation();

  const navItems = [
    { path: '/app', icon: ListTodo, label: t('tasks') },
    { path: '/calendar', icon: Calendar, label: t('calendar') },
    { path: '/focus', icon: Target, label: t('focus') },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 glass-card border-b"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">



          <Link to="/">
            <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.02 }}>
              <div className="w-9 h-9 rounded-xl gradient-flower flex items-center justify-center shadow-lg">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold  leading-tight">{t('appTitle')}</h1>
                <p className="text-[10px] text-muted-foreground leading-tight">{t('appSubtitle')}</p>
              </div>
            </motion.div>
          </Link>


          <nav className="flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link key={path} to={path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`gap-1.5 text-xs ${isActive ? 'gradient-primary text-primary-foreground shadow-md' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>


          <div className="flex items-center gap-2">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="text-xs font-bold text-primary">
                Lv.{levelInfo.level}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {stats.totalPoints}⭐
              </span>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              <span className="text-xs font-bold">{language === 'ar' ? 'EN' : 'ع'}</span>
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
