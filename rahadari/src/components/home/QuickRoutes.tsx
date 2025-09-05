import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { MAJOR_CITIES } from '../../utils/constants';

const QuickRoutes: React.FC = () => {
  const { t } = useTranslation();

  const popularRoutes = [
    { from: 'Mumbai', to: 'Pune', distance: '150 km', duration: '3h 30m' },
    { from: 'Delhi', to: 'Jaipur', distance: '280 km', duration: '5h 15m' },
    { from: 'Bangalore', to: 'Chennai', distance: '350 km', duration: '6h 45m' },
    { from: 'Hyderabad', to: 'Bangalore', distance: '570 km', duration: '9h 20m' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Navigation className="w-5 h-5 mr-2" />
        Popular Routes
      </h3>
      
      <div className="space-y-3">
        {popularRoutes.map((route, index) => (
          <motion.button
            key={`${route.from}-${route.to}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="w-full p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 text-white font-medium">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{route.from}</span>
                  <span className="text-gray-400">→</span>
                  <span>{route.to}</span>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {route.duration}
                  </span>
                  <span>{route.distance}</span>
                </div>
              </div>
              <div className="text-blue-400">
                <Navigation className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Major Cities */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Major Cities</h4>
        <div className="grid grid-cols-2 gap-2">
          {MAJOR_CITIES.slice(0, 6).map((city, index) => (
            <motion.button
              key={city.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-white/5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              {city.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickRoutes;