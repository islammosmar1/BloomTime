import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Flower2, Sun, Moon, Sparkles, Heart, Clock, Trophy, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

const Home: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();



  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating flowers */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {i % 2 === 0 ? '🌸' : '🌻'}
          </motion.div>
        ))}
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'hsl(var(--primary) / 0.15)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'hsl(var(--secondary) / 0.15)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.2, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl gradient-flower flex items-center justify-center shadow-lg">
              <Flower2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold ">BloomTime</h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Main Heading */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" />
            {language === 'ar' ? 'طريقة جديدة للدراسة' : 'A new way to study'}
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-foreground">
              {language === 'ar' ? 'اجعل الدراسة' : 'Make studying'}
            </span>
            <br />
            <span className="">
              {language === 'ar' ? 'تجربة ممتعة' : 'an enjoyable experience'}
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            {language === 'ar'
              ? 'نظم مهامك بطريقة بصرية جميلة. شاهد الوقت يزدهر، لا يفر منك.'
              : "Organize your tasks visually. Watch time bloom, not run away."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/app">
              <Button size="lg" className="gradient-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6">
                {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                <ArrowRight className="w-5 h-5 ms-2" />
              </Button>
            </Link>
          </div>

          {/* Animated Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-8 max-w-lg mx-auto">
              {/* Demo Flower */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {/* Petals */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-16 rounded-full bg-gradient-to-t from-pink-400 to-pink-300"
                      style={{
                        transformOrigin: 'bottom center',
                        transform: `rotate(${i * 45}deg) translateY(-20px)`,
                        left: '50%',
                        marginLeft: '-16px',
                        top: '50%',
                        marginTop: '-32px',
                      }}
                      animate={{
                        rotate: i * 45 + (i % 2 === 0 ? 3 : -3),
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                  {/* Center */}
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 shadow-lg z-10" />
                </motion.div>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold  mb-2">25:00</p>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'جلسة دراسة' : 'Study Session'}
                </p>
              </div>

              {/* Falling petal animation */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-300"
                  style={{
                    left: `${40 + i * 10}%`,
                    top: '30%',
                  }}
                  animate={{
                    y: [0, 100, 150],
                    x: [0, 20 * (i % 2 === 0 ? 1 : -1), 40 * (i % 2 === 0 ? 1 : -1)],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1.5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto"
        >
        
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <p className="text-xl italic text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? '"نريد موقعاً يجعل الطلاب يستمتعون بالدراسة، حيث يبدو الوقت وكأنه ينمو، لا يهرب"'
              : '"We want a website that makes students enjoy studying, where time feels like it is growing, not running away"'}
          </p>
          <Heart className="w-6 h-6 mx-auto mt-4 text-primary" />
        </motion.div>
      </main>

      {/* Footer Wave */}
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

export default Home;
