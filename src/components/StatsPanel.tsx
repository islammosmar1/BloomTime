import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Star, Award, Lock, Unlock, Palette, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePoints } from '@/contexts/PointsContext';
import { useLanguage } from '@/contexts/LanguageContext';

const StatsPanel: React.FC = () => {
  const { stats, badges, getLevel } = usePoints();
  const { language, t } = useLanguage();
  const levelInfo = getLevel(stats.totalPoints);

  const earnedBadgesList = badges.filter(b => stats.earnedBadges.includes(b.id));
  const nextBadges = badges.filter(b => !stats.earnedBadges.includes(b.id)).slice(0, 3);

  // Unlockable flower types based on points
  const flowerTypes = [
    { id: 'rose', icon: '🌹', nameAr: 'وردة', nameEn: 'Rose', requiredPoints: 0 },
    { id: 'sunflower', icon: '🌻', nameAr: 'عباد الشمس', nameEn: 'Sunflower', requiredPoints: 50 },
    { id: 'lily', icon: '🌷', nameAr: 'زنبق', nameEn: 'Lily', requiredPoints: 100 },
    { id: 'tulip', icon: '🌺', nameAr: 'توليب', nameEn: 'Tulip', requiredPoints: 200 },
    { id: 'cherry', icon: '🌸', nameAr: 'زهر الكرز', nameEn: 'Cherry Blossom', requiredPoints: 300 },
    { id: 'lotus', icon: '🪷', nameAr: 'لوتس', nameEn: 'Lotus', requiredPoints: 500 },
  ];

  // Unlockable backgrounds
  const backgrounds = [
    { id: 'garden', icon: '🏡', nameAr: 'حديقة', nameEn: 'Garden', requiredPoints: 0 },
    { id: 'forest', icon: '🌲', nameAr: 'غابة', nameEn: 'Forest', requiredPoints: 100 },
    { id: 'beach', icon: '🏖️', nameAr: 'شاطئ', nameEn: 'Beach', requiredPoints: 200 },
    { id: 'mountain', icon: '🏔️', nameAr: 'جبل', nameEn: 'Mountain', requiredPoints: 300 },
    { id: 'space', icon: '🌌', nameAr: 'فضاء', nameEn: 'Space', requiredPoints: 500 },
  ];

  return (
    <div className="space-y-4">
      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {levelInfo.level}
              </motion.div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('level')}</p>
                <h3 className="text-xl font-bold ">
                  {language === 'ar' ? levelInfo.title.ar : levelInfo.title.en}
                </h3>
                <div className="mt-2">
                  <Progress value={levelInfo.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalPoints} {t('points')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">{t('streak')}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">{t('tasksCompleted')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-medium">{t('dailyGoal')}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.todayCompleted}/{stats.dailyGoal}
              </span>
            </div>
            <Progress 
              value={(stats.todayCompleted / stats.dailyGoal) * 100} 
              className="h-3"
            />
            {stats.todayCompleted >= stats.dailyGoal && (
              <motion.p 
                className="text-center text-sm text-primary mt-2 font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                🎉 {t('goalAchieved')}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for Badges and Unlockables */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            {t('earnedBadges')}
          </TabsTrigger>
          <TabsTrigger value="unlockables" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t('unlockables')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4 mt-4">
          {/* Earned Badges */}
          {earnedBadgesList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {t('earnedBadges')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {earnedBadgesList.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20"
                        title={language === 'ar' ? badge.description.ar : badge.description.en}
                      >
                        <span className="text-xl">{badge.icon}</span>
                        <span className="text-sm font-medium">
                          {language === 'ar' ? badge.name.ar : badge.name.en}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Next Badges */}
          {nextBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-muted-foreground" />
                    {t('nextBadges')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {nextBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 opacity-60"
                      >
                        <span className="text-xl grayscale">{badge.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {language === 'ar' ? badge.name.ar : badge.name.en}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {language === 'ar' ? badge.description.ar : badge.description.en}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="unlockables" className="space-y-4 mt-4">
          {/* Flower Types */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('flowerTypes')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3">
                {flowerTypes.map((flower) => {
                  const isUnlocked = stats.totalPoints >= flower.requiredPoints;
                  return (
                    <motion.div
                      key={flower.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isUnlocked
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted/50 opacity-60'
                      }`}
                    >
                      <span className={`text-2xl ${!isUnlocked ? 'grayscale' : ''}`}>
                        {flower.icon}
                      </span>
                      <p className="text-xs font-medium mt-1">
                        {language === 'ar' ? flower.nameAr : flower.nameEn}
                      </p>
                      {!isUnlocked && (
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                          <Lock className="w-3 h-3" />
                          {flower.requiredPoints}
                        </div>
                      )}
                      {isUnlocked && (
                        <div className="flex items-center justify-center gap-1 text-xs text-primary mt-1">
                          <Unlock className="w-3 h-3" />
                          {t('unlocked')}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Backgrounds */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('backgrounds')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3">
                {backgrounds.map((bg) => {
                  const isUnlocked = stats.totalPoints >= bg.requiredPoints;
                  return (
                    <motion.div
                      key={bg.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isUnlocked
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-muted/50 opacity-60'
                      }`}
                    >
                      <span className={`text-2xl ${!isUnlocked ? 'grayscale' : ''}`}>
                        {bg.icon}
                      </span>
                      <p className="text-xs font-medium mt-1">
                        {language === 'ar' ? bg.nameAr : bg.nameEn}
                      </p>
                      {!isUnlocked && (
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
                          <Lock className="w-3 h-3" />
                          {bg.requiredPoints}
                        </div>
                      )}
                      {isUnlocked && (
                        <div className="flex items-center justify-center gap-1 text-xs text-primary mt-1">
                          <Unlock className="w-3 h-3" />
                          {t('unlocked')}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsPanel;
