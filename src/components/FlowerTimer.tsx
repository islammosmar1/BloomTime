import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlowerTimerProps {
  progress: number; // 0 to 1
  isActive: boolean;
  isPaused?: boolean;
  flowerType?: 'rose' | 'sunflower' | 'lily' | 'tulip';
  size?: 'sm' | 'md' | 'lg';
}

const flowerThemes = {
  rose: {
    petalColors: ['#f472b6', '#fb7185', '#f9a8d4', '#ec4899', '#e879a0'],
    centerGradient: 'url(#roseCenter)',
    glowColor: 'rgba(244, 114, 182, 0.35)',
  },
  sunflower: {
    petalColors: ['#fbbf24', '#f59e0b', '#fcd34d', '#d97706', '#facc15'],
    centerGradient: 'url(#sunflowerCenter)',
    glowColor: 'rgba(251, 191, 36, 0.35)',
  },
  lily: {
    petalColors: ['#e9d5ff', '#d8b4fe', '#f3e8ff', '#c084fc', '#ddd6fe'],
    centerGradient: 'url(#lilyCenter)',
    glowColor: 'rgba(192, 132, 252, 0.35)',
  },
  tulip: {
    petalColors: ['#f87171', '#ef4444', '#fca5a5', '#dc2626', '#fb923c'],
    centerGradient: 'url(#tulipCenter)',
    glowColor: 'rgba(248, 113, 113, 0.35)',
  },
};

const sizes = {
  sm: { width: 180, height: 240, petalW: 18, petalH: 40, centerR: 18, stemH: 80 },
  md: { width: 220, height: 290, petalW: 22, petalH: 50, centerR: 22, stemH: 100 },
  lg: { width: 280, height: 360, petalW: 28, petalH: 60, centerR: 28, stemH: 120 },
};

const FlowerTimer: React.FC<FlowerTimerProps> = ({
  progress,
  isActive,
  isPaused = false,
  flowerType = 'rose',
  size = 'md',
}) => {
  const theme = flowerThemes[flowerType];
  const s = sizes[size];
  const totalPetals = 10;
  const remainingPetals = Math.ceil((1 - progress) * totalPetals);
  const cx = s.width / 2;
  const flowerCenterY = s.height - s.stemH - s.centerR - 20;

  const petals = useMemo(() =>
    Array.from({ length: totalPetals }, (_, i) => ({
      id: i,
      angle: (i * 360) / totalPetals,
      visible: i < remainingPetals,
      color: theme.petalColors[i % theme.petalColors.length],
    })), [remainingPetals, theme.petalColors]);

  const fallingPetals = useMemo(() => {
    const count = totalPetals - remainingPetals;
    return Array.from({ length: Math.min(count, 4) }, (_, i) => ({
      id: `fall-${remainingPetals}-${i}`,
      delay: i * 0.8,
      startX: cx + (Math.random() - 0.5) * 40,
      color: theme.petalColors[i % theme.petalColors.length],
    }));
  }, [remainingPetals, cx, theme.petalColors]);

  const wiltScale = isPaused ? 0.92 : 1;
  const wiltRotate = isPaused ? 8 : 0;
  const saturation = isPaused ? 0.6 : 1;

  return (
    <div className="relative mx-auto" style={{ width: s.width, height: s.height }}>
      {/* Glow */}
      {isActive && (
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            width: s.centerR * 5,
            height: s.centerR * 5,
            left: cx - s.centerR * 2.5,
            top: flowerCenterY - s.centerR * 2,
            background: theme.glowColor,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Falling petals */}
      <AnimatePresence>
        {fallingPetals.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: flowerCenterY, x: p.startX, rotate: 0, scale: 1 }}
            animate={{
              opacity: [1, 0.9, 0.6, 0],
              y: [flowerCenterY, flowerCenterY + 60, flowerCenterY + 130, s.height + 20],
              x: [p.startX, p.startX + 25, p.startX - 15, p.startX + 35],
              rotate: [0, 120, 240, 360],
              scale: [1, 0.85, 0.7, 0.4],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5, delay: p.delay, ease: 'easeOut' }}
            className="absolute"
            style={{ filter: `saturate(${saturation})` }}
          >
            <svg width={s.petalW} height={s.petalH} viewBox="0 0 24 48">
              <ellipse cx="12" cy="24" rx="10" ry="22" fill={p.color} opacity="0.85" />
              <ellipse cx="12" cy="20" rx="3" ry="16" fill="white" opacity="0.2" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      <svg width={s.width} height={s.height} viewBox={`0 0 ${s.width} ${s.height}`}>
        <defs>
          {/* Center gradients */}
          <radialGradient id="roseCenter" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="sunflowerCenter" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="60%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>
          <radialGradient id="lilyCenter" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <radialGradient id="tulipCenter" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </radialGradient>
          {/* Stem gradient */}
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          {/* Petal highlight */}
          <filter id="petalShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Stem */}
        <motion.g animate={{ rotate: wiltRotate }} style={{ transformOrigin: `${cx}px ${s.height}px` }}>
          <rect
            x={cx - 2.5}
            y={flowerCenterY + s.centerR - 5}
            width={5}
            rx={2.5}
            height={s.stemH}
            fill="url(#stemGrad)"
          />
          {/* Highlight on stem */}
          <rect
            x={cx - 1}
            y={flowerCenterY + s.centerR}
            width={1.5}
            rx={0.75}
            height={s.stemH * 0.7}
            fill="rgba(255,255,255,0.2)"
          />

          {/* Left leaf */}
          <motion.g
            animate={isActive ? { rotate: [-3, 3, -3] } : { rotate: isPaused ? -8 : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0 }}
            style={{ transformOrigin: `${cx}px ${flowerCenterY + s.stemH * 0.5}px` }}
          >
            <ellipse
              cx={cx - 18}
              cy={flowerCenterY + s.stemH * 0.5}
              rx={16}
              ry={7}
              fill="url(#leafGrad)"
              transform={`rotate(-30 ${cx - 18} ${flowerCenterY + s.stemH * 0.5})`}
              opacity={isPaused ? 0.65 : 0.9}
            />
            <line
              x1={cx - 5}
              y1={flowerCenterY + s.stemH * 0.5}
              x2={cx - 28}
              y2={flowerCenterY + s.stemH * 0.45}
              stroke="#15803d"
              strokeWidth="0.8"
              opacity="0.5"
            />
          </motion.g>

          {/* Right leaf */}
          <motion.g
            animate={isActive ? { rotate: [3, -3, 3] } : { rotate: isPaused ? 8 : 0 }}
            transition={{ duration: 3, repeat: isActive ? Infinity : 0, delay: 0.5 }}
            style={{ transformOrigin: `${cx}px ${flowerCenterY + s.stemH * 0.3}px` }}
          >
            <ellipse
              cx={cx + 18}
              cy={flowerCenterY + s.stemH * 0.3}
              rx={14}
              ry={6}
              fill="url(#leafGrad)"
              transform={`rotate(25 ${cx + 18} ${flowerCenterY + s.stemH * 0.3})`}
              opacity={isPaused ? 0.65 : 0.9}
            />
            <line
              x1={cx + 5}
              y1={flowerCenterY + s.stemH * 0.3}
              x2={cx + 26}
              y2={flowerCenterY + s.stemH * 0.26}
              stroke="#15803d"
              strokeWidth="0.8"
              opacity="0.5"
            />
          </motion.g>
        </motion.g>

        {/* Flower head group */}
        <motion.g
          animate={{ scale: wiltScale, rotate: wiltRotate }}
          style={{
            transformOrigin: `${cx}px ${flowerCenterY}px`,
            filter: `saturate(${saturation})`,
          }}
        >
          {/* Petals */}
          {petals.map((petal) => (
            <motion.g
              key={petal.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: petal.visible ? 1 : 0,
                scale: petal.visible ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: `${cx}px ${flowerCenterY}px` }}
            >
              <motion.ellipse
                cx={cx}
                cy={flowerCenterY - s.petalH / 2 - s.centerR * 0.5}
                rx={s.petalW / 2}
                ry={s.petalH / 2}
                fill={petal.color}
                filter="url(#petalShadow)"
                transform={`rotate(${petal.angle} ${cx} ${flowerCenterY})`}
                animate={
                  isActive && petal.visible
                    ? { ry: [s.petalH / 2, s.petalH / 2 + 2, s.petalH / 2] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity, delay: petal.id * 0.15 }}
              />
              {/* Petal vein / highlight */}
              <ellipse
                cx={cx}
                cy={flowerCenterY - s.petalH / 2 - s.centerR * 0.5 - 4}
                rx={s.petalW / 6}
                ry={s.petalH / 3}
                fill="white"
                opacity="0.18"
                transform={`rotate(${petal.angle} ${cx} ${flowerCenterY})`}
              />
            </motion.g>
          ))}

          {/* Center */}
          <motion.circle
            cx={cx}
            cy={flowerCenterY}
            r={s.centerR}
            fill={theme.centerGradient}
            animate={
              isActive
                ? { r: [s.centerR, s.centerR + 1.5, s.centerR] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Center texture dots */}
          {Array.from({ length: 7 }, (_, i) => {
            const angle = (i * 360) / 7;
            const r = s.centerR * 0.45;
            const dx = cx + r * Math.cos((angle * Math.PI) / 180);
            const dy = flowerCenterY + r * Math.sin((angle * Math.PI) / 180);
            return (
              <circle key={i} cx={dx} cy={dy} r={1.5} fill="rgba(0,0,0,0.15)" />
            );
          })}
          {/* Inner highlight */}
          <circle
            cx={cx - s.centerR * 0.25}
            cy={flowerCenterY - s.centerR * 0.25}
            r={s.centerR * 0.35}
            fill="white"
            opacity="0.2"
          />
        </motion.g>

        {/* Sparkles */}
        {isActive &&
          Array.from({ length: 5 }, (_, i) => {
            const sx = cx + (Math.random() - 0.5) * s.width * 0.7;
            const sy = flowerCenterY + (Math.random() - 0.5) * 60;
            return (
              <motion.circle
                key={`sparkle-${i}`}
                cx={sx}
                cy={sy}
                r={1.5}
                fill="#fde68a"
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              />
            );
          })}
      </svg>

      {/* Progress ring */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <motion.circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={150.8}
              animate={{ strokeDashoffset: 150.8 * progress }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-foreground">
              {Math.round((1 - progress) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerTimer;
