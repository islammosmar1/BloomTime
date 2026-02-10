import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SunTimerProps {
  progress: number; // 0 to 1
  isActive: boolean;
}

// Animated stars component
const AnimatedStars: React.FC<{ opacity: number }> = ({ opacity }) => {
  const stars = [
    { x: 15, y: 12, size: 1.5, delay: 0 },
    { x: 85, y: 18, size: 2, delay: 0.3 },
    { x: 25, y: 25, size: 1, delay: 0.6 },
    { x: 70, y: 8, size: 1.5, delay: 0.9 },
    { x: 45, y: 15, size: 1, delay: 1.2 },
    { x: 55, y: 28, size: 2, delay: 0.2 },
    { x: 35, y: 8, size: 1, delay: 0.8 },
    { x: 90, y: 30, size: 1.5, delay: 0.5 },
    { x: 8, y: 22, size: 1, delay: 1.1 },
    { x: 62, y: 20, size: 1.5, delay: 0.4 },
  ];

  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
          }}
          animate={{
            opacity: [opacity * 0.5, opacity, opacity * 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </>
  );
};

const SunTimer: React.FC<SunTimerProps> = ({ progress, isActive }) => {
  const sunY = progress * 80;
  const skyHue = 200 - progress * 180; // Blue to orange
  const skyLightness = 85 - progress * 45;
  
  // Stars appear gradually
  const starsOpacity = Math.max(0, (progress - 0.4) * 2);
  
  // Moon appears at end
  const moonOpacity = Math.max(0, (progress - 0.7) * 3);

  return (
    <div className="relative w-64 h-56 mx-auto overflow-hidden rounded-3xl shadow-2xl">
      {/* Animated sky gradient */}
      <motion.div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, 
            hsl(${skyHue} 80% ${skyLightness}%) 0%,
            hsl(${skyHue - 30} 70% ${skyLightness - 20}%) 40%,
            hsl(${25 + progress * 20} ${70 - progress * 30}% ${60 - progress * 35}%) 100%)`,
        }}
      />

      {/* Clouds */}
      <motion.div
        className="absolute top-6 left-4"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ opacity: 1 - progress * 0.8 }}
      >
        <div className="flex">
          <div className="w-8 h-4 bg-white/60 rounded-full" />
          <div className="w-6 h-4 bg-white/60 rounded-full -ml-2" />
          <div className="w-10 h-5 bg-white/70 rounded-full -ml-3 -mt-1" />
        </div>
      </motion.div>
      
      <motion.div
        className="absolute top-12 right-6"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
        style={{ opacity: 1 - progress * 0.9 }}
      >
        <div className="flex">
          <div className="w-6 h-3 bg-white/50 rounded-full" />
          <div className="w-8 h-4 bg-white/60 rounded-full -ml-2 -mt-0.5" />
        </div>
      </motion.div>

      {/* Stars with twinkling effect */}
      <AnimatedStars opacity={starsOpacity} />

      {/* Moon */}
      <motion.div
        className="absolute top-4 right-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: moonOpacity, scale: moonOpacity > 0 ? 1 : 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-lg">
          {/* Moon craters */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-300/50" />
          <div className="absolute top-5 left-4 w-1.5 h-1.5 rounded-full bg-gray-300/50" />
          <div className="absolute top-3 right-2 w-1 h-1 rounded-full bg-gray-300/50" />
          {/* Moon glow */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md -z-10 scale-150" />
        </div>
      </motion.div>

      {/* Sun with enhanced effects */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: `${8 + sunY * 0.5}%` }}
        animate={isActive ? { 
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Sun glow layers */}
        <div 
          className="absolute inset-0 rounded-full blur-xl scale-150"
          style={{
            background: `radial-gradient(circle, hsl(45 95% 60% / ${0.6 - progress * 0.4}) 0%, transparent 70%)`,
          }}
        />
        <div 
          className="absolute inset-0 rounded-full blur-md scale-125"
          style={{
            background: `radial-gradient(circle, hsl(35 95% 55% / ${0.4 - progress * 0.3}) 0%, transparent 60%)`,
          }}
        />
        
        {/* Main sun body */}
        <motion.div 
          className="relative w-20 h-20 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, 
              hsl(50 95% ${70 - progress * 20}%) 0%,
              hsl(45 95% ${55 - progress * 15}%) 40%,
              hsl(25 95% ${50 - progress * 20}%) 100%)`,
            boxShadow: `
              0 0 ${60 - progress * 30}px hsl(45 95% 55% / ${0.7 - progress * 0.4}),
              0 0 ${100 - progress * 50}px hsl(35 95% 50% / ${0.4 - progress * 0.3})
            `,
          }}
        >
          {/* Sun face (optional cute style) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-70">
            <div className="relative">
              {/* Eyes */}
              <div className="flex gap-4 mb-1">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-orange-800/60"
                  animate={isActive ? { scaleY: [1, 0.1, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-orange-800/60"
                  animate={isActive ? { scaleY: [1, 0.1, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
              {/* Smile */}
              <div className="w-6 h-3 border-b-2 border-orange-800/50 rounded-b-full mx-auto" />
            </div>
          </div>
        </motion.div>

        {/* Animated sun rays */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '3px',
              height: `${16 - progress * 8}px`,
              background: `linear-gradient(to top, hsl(45 95% ${60 - progress * 20}%), transparent)`,
              left: '50%',
              top: '50%',
              transformOrigin: '50% 50%',
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${48 - progress * 10}px)`,
              opacity: 1 - progress * 0.8,
              borderRadius: '2px',
            }}
            animate={isActive ? { 
              height: [`${16 - progress * 8}px`, `${20 - progress * 10}px`, `${16 - progress * 8}px`],
              opacity: [(1 - progress * 0.8), (0.8 - progress * 0.6), (1 - progress * 0.8)],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>

      {/* Horizon gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20"
        style={{
          background: `linear-gradient(0deg, 
            hsl(var(--primary) / 0.4) 0%, 
            hsl(${25 + progress * 20} 60% 40% / 0.2) 50%,
            transparent 100%)`,
        }}
      />

      {/* Hills with depth */}
      <svg 
        className="absolute bottom-0 left-0 right-0 h-16" 
        viewBox="0 0 100 30" 
        preserveAspectRatio="none"
      >
        {/* Back hill */}
        <path 
          d="M0 30 Q15 10 35 20 Q55 30 75 15 Q90 5 100 18 L100 30 Z" 
          fill="hsl(var(--primary) / 0.25)"
        />
        {/* Middle hill */}
        <path 
          d="M0 30 Q25 15 50 22 Q75 28 100 20 L100 30 Z" 
          fill="hsl(var(--primary) / 0.35)"
        />
        {/* Front hill */}
        <path 
          d="M0 30 Q20 22 40 26 Q60 30 80 24 Q95 20 100 25 L100 30 Z" 
          fill="hsl(var(--primary) / 0.5)"
        />
      </svg>

      {/* Trees silhouettes */}
      <svg 
        className="absolute bottom-2 left-4 w-6 h-10" 
        viewBox="0 0 20 40"
        style={{ opacity: 0.3 + progress * 0.4 }}
      >
        <path d="M10 40 L10 25" stroke="hsl(var(--primary))" strokeWidth="2" />
        <path d="M10 25 L5 30 L10 20 L15 30 Z" fill="hsl(var(--primary))" />
        <path d="M10 20 L6 24 L10 15 L14 24 Z" fill="hsl(var(--primary))" />
      </svg>
      <svg 
        className="absolute bottom-2 right-6 w-5 h-8" 
        viewBox="0 0 20 40"
        style={{ opacity: 0.25 + progress * 0.35 }}
      >
        <path d="M10 40 L10 28" stroke="hsl(var(--primary))" strokeWidth="2" />
        <path d="M10 28 L6 32 L10 22 L14 32 Z" fill="hsl(var(--primary))" />
      </svg>

      {/* Progress indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <div 
          className="px-3 py-1.5 rounded-full backdrop-blur-md"
          style={{ 
            background: 'hsl(var(--background) / 0.8)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                style={{ width: `${(1 - progress) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs font-bold text-foreground">
              {Math.round((1 - progress) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunTimer;
