import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
      <div className="text-center">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto">
            <Cloud className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Rahadari
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-white/80 mb-8"
        >
          Weather-Integrated Route Planning
        </motion.p>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center space-x-2"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 bg-white rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 bg-white rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 bg-white rounded-full"
          />
        </motion.div>

        {/* Weather Icons Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center space-x-4 mt-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-6 h-6 text-yellow-300" />
          </motion.div>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Cloud className="w-6 h-6 text-white/60" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CloudRain className="w-6 h-6 text-blue-300" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;