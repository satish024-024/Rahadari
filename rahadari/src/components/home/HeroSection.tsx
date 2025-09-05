import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {/* Floating Weather Icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-white/20"
        >
          <Sun className="w-16 h-16" />
        </motion.div>
        
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-20 text-white/20"
        >
          <Cloud className="w-20 h-20" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 text-white/20"
        >
          <CloudRain className="w-14 h-14" />
        </motion.div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 right-1/3 text-white/20"
        >
          <Wind className="w-12 h-12" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t('app.name')}
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 mb-8"
          >
            {t('app.tagline')}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-white/70 mb-12 max-w-2xl mx-auto"
          >
            {t('app.description')}
          </motion.p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { icon: '🌦️', text: 'Real-time Weather' },
            { icon: '🗺️', text: 'Smart Routing' },
            { icon: '⚡', text: 'Instant Updates' },
            { icon: '🇮🇳', text: 'India Coverage' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 flex items-center space-x-2"
            >
              <span className="text-lg">{feature.icon}</span>
              <span className="text-white/90 text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;