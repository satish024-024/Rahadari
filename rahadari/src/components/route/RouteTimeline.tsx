import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, Wind, Eye, Droplets, AlertTriangle } from 'lucide-react';
import { WeatherPoint } from '../../types/weather';
import { getWeatherColor, getWeatherSeverity, getWeatherLabel } from '../../utils/weatherUtils';

interface RouteTimelineProps {
  points: WeatherPoint[];
}

export const RouteTimeline: React.FC<RouteTimelineProps> = ({ points }) => {
  const getWeatherIcon = (condition: string, rainProb: number) => {
    if (rainProb > 70) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (rainProb > 40) return <Cloud className="w-6 h-6 text-gray-400" />;
    return <Sun className="w-6 h-6 text-yellow-400" />;
  };

  const getWeatherColorClass = (rainProb: number) => {
    if (rainProb > 70) return 'bg-red-500';
    if (rainProb > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSeverityClass = (rainProb: number) => {
    const severity = getWeatherSeverity(rainProb);
    return `severity-${severity}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-6">Journey Weather Timeline</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400" />
        
        {/* Weather Points */}
        <div className="space-y-6">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Timeline Dot */}
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-full ${getWeatherColorClass(point.weather.rainProbability)} bg-opacity-20 flex items-center justify-center`}>
                  <div className={`w-12 h-12 rounded-full ${getWeatherColorClass(point.weather.rainProbability)} bg-opacity-40 flex items-center justify-center`}>
                    {getWeatherIcon(point.weather.condition, point.weather.rainProbability)}
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white text-lg">{point.location}</h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(point.time).toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} • {point.distance.toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{point.weather.temperature}°C</p>
                    <p className={`text-sm font-medium ${
                      point.weather.rainProbability > 70 ? 'text-red-400' : 
                      point.weather.rainProbability > 40 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {point.weather.rainProbability}% rain
                    </p>
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{point.weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{point.weather.visibility} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{point.weather.humidity}%</span>
                  </div>
                </div>

                {/* Condition Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSeverityClass(point.weather.rainProbability)}`}>
                    {point.weather.condition}
                  </span>
                  
                  {/* Weather Alert */}
                  {point.weather.rainProbability > 70 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">High Risk</span>
                    </div>
                  )}
                </div>

                {/* Weather Description */}
                <p className="text-sm text-gray-400 mt-2">
                  {point.weather.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <h4 className="font-semibold text-white mb-2">Journey Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Distance:</span>
            <span className="text-white ml-2">{points[points.length - 1]?.distance.toFixed(1)} km</span>
          </div>
          <div>
            <span className="text-gray-400">Duration:</span>
            <span className="text-white ml-2">
              {points.length > 1 ? 
                `${Math.round((new Date(points[points.length - 1].time).getTime() - new Date(points[0].time).getTime()) / (1000 * 60))} min` : 
                'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-400">Weather Risk:</span>
            <span className={`ml-2 font-medium ${
              points.some(p => p.weather.rainProbability > 70) ? 'text-red-400' :
              points.some(p => p.weather.rainProbability > 40) ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {points.some(p => p.weather.rainProbability > 70) ? 'High' :
               points.some(p => p.weather.rainProbability > 40) ? 'Medium' : 'Low'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Avg Temperature:</span>
            <span className="text-white ml-2">
              {Math.round(points.reduce((sum, p) => sum + p.weather.temperature, 0) / points.length)}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};