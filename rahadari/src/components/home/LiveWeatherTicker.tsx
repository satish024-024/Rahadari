import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Cloud, Sun, CloudRain, Wind, Eye, Droplets } from 'lucide-react';
import { WeatherData } from '../../types/weather';
import { useWeather } from '../../hooks/useWeather';

const LiveWeatherTicker: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Mock weather data for major cities
  const mockWeatherData: WeatherData[] = [
    {
      temperature: 28,
      humidity: 65,
      rainProbability: 20,
      windSpeed: 12,
      visibility: 10,
      condition: 'clear',
      icon: '☀️',
      timestamp: Date.now(),
      source: 'mock',
      confidence: 'high',
      description: 'Clear sky',
      pressure: 1013,
      feelsLike: 30,
    },
    {
      temperature: 32,
      humidity: 70,
      rainProbability: 60,
      windSpeed: 8,
      visibility: 8,
      condition: 'rain',
      icon: '🌧️',
      timestamp: Date.now(),
      source: 'mock',
      confidence: 'high',
      description: 'Light rain',
      pressure: 1008,
      feelsLike: 35,
    },
    {
      temperature: 25,
      humidity: 80,
      rainProbability: 40,
      windSpeed: 15,
      visibility: 6,
      condition: 'cloudy',
      icon: '☁️',
      timestamp: Date.now(),
      source: 'mock',
      confidence: 'high',
      description: 'Partly cloudy',
      pressure: 1015,
      feelsLike: 27,
    },
  ];

  const cities = ['Mumbai', 'Delhi', 'Bangalore'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cities.length]);

  const currentWeather = mockWeatherData[currentIndex];
  const currentCity = cities[currentIndex];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-gray-400" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getWeatherColor = (rainProbability: number) => {
    if (rainProbability > 60) return 'text-red-400';
    if (rainProbability > 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Cloud className="w-5 h-5 mr-2" />
        Live Weather
      </h3>

      <div className="relative h-32 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white font-medium">{currentCity}</h4>
                <p className="text-gray-400 text-sm">{currentWeather.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {currentWeather.temperature}°C
                </div>
                <div className="text-sm text-gray-400">
                  Feels like {currentWeather.feelsLike}°C
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-white/80">{currentWeather.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-gray-400" />
                <span className="text-white/80">{currentWeather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-white/80">{currentWeather.visibility} km</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getWeatherIcon(currentWeather.condition)}
                <span className="text-white/80 text-sm">{currentWeather.condition}</span>
              </div>
              <div className={`text-sm font-medium ${getWeatherColor(currentWeather.rainProbability)}`}>
                {currentWeather.rainProbability}% rain
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* City Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {cities.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LiveWeatherTicker;