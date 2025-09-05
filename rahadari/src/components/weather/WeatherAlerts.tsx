import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Wind, Eye, Thermometer } from 'lucide-react';
import { WeatherPoint } from '../../types/weather';

interface WeatherAlertsProps {
  weatherPoints: WeatherPoint[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ weatherPoints }) => {
  const alerts: Array<{
    id: string;
    type: string;
    severity: string;
    message: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = [];

  // Check for various weather alerts
  weatherPoints.forEach((point, index) => {
    const { weather } = point;

    // Heavy rain alert
    if (weather.rainProbability > 70) {
      alerts.push({
        id: `heavy-rain-${index}`,
        type: 'rain',
        severity: 'high',
        message: `Heavy rain expected at ${point.location}`,
        icon: <CloudRain className="w-5 h-5" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
      });
    }

    // Strong winds alert
    if (weather.windSpeed > 30) {
      alerts.push({
        id: `strong-winds-${index}`,
        type: 'wind',
        severity: 'medium',
        message: `Strong winds (${weather.windSpeed} km/h) at ${point.location}`,
        icon: <Wind className="w-5 h-5" />,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/30',
      });
    }

    // Poor visibility alert
    if (weather.visibility < 2) {
      alerts.push({
        id: `poor-visibility-${index}`,
        type: 'visibility',
        severity: 'high',
        message: `Poor visibility (${weather.visibility} km) at ${point.location}`,
        icon: <Eye className="w-5 h-5" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
      });
    }

    // Extreme temperature alerts
    if (weather.temperature > 40) {
      alerts.push({
        id: `extreme-heat-${index}`,
        type: 'heat',
        severity: 'high',
        message: `Extreme heat (${weather.temperature}°C) at ${point.location}`,
        icon: <Thermometer className="w-5 h-5" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
      });
    } else if (weather.temperature < 5) {
      alerts.push({
        id: `extreme-cold-${index}`,
        type: 'cold',
        severity: 'medium',
        message: `Cold weather (${weather.temperature}°C) at ${point.location}`,
        icon: <Thermometer className="w-5 h-5" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
      });
    }
  });

  // Remove duplicates
  const uniqueAlerts = alerts.filter((alert, index, self) => 
    index === self.findIndex(a => a.type === alert.type)
  );

  if (uniqueAlerts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
        Weather Alerts
      </h3>

      <div className="space-y-3">
        {uniqueAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${alert.bgColor} ${alert.borderColor}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`${alert.color} mt-0.5`}>
                {alert.icon}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${alert.color}`}>
                  {alert.message}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  }`}>
                    {alert.severity === 'high' ? 'High Risk' : 'Medium Risk'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Safety Recommendations */}
      <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
        <h4 className="text-sm font-semibold text-yellow-300 mb-2">Safety Recommendations:</h4>
        <ul className="text-sm text-yellow-200 space-y-1">
          {uniqueAlerts.some(a => a.type === 'rain') && (
            <li>• Carry waterproof gear and drive carefully</li>
          )}
          {uniqueAlerts.some(a => a.type === 'wind') && (
            <li>• Reduce speed and maintain firm control</li>
          )}
          {uniqueAlerts.some(a => a.type === 'visibility') && (
            <li>• Use headlights and increase following distance</li>
          )}
          {uniqueAlerts.some(a => a.type === 'heat') && (
            <li>• Stay hydrated and take frequent breaks</li>
          )}
          {uniqueAlerts.some(a => a.type === 'cold') && (
            <li>• Dress warmly and check vehicle fluids</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
};