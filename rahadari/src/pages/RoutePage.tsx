import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, List, AlertTriangle } from 'lucide-react';
import { RouteTimeline } from '../components/route/RouteTimeline';
import { RouteMap } from '../components/route/RouteMap';
import { WeatherAlerts } from '../components/weather/WeatherAlerts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useRouteWeather } from '../hooks/useWeather';
import { useRoute } from '../hooks/useRoute';
import { WeatherPoint } from '../types/weather';
import { Route } from '../types/route';

const RoutePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');
  const [route, setRoute] = useState<Route | null>(null);
  const [weatherPoints, setWeatherPoints] = useState<WeatherPoint[]>([]);

  // Get route data from navigation state
  const routeData = location.state as {
    source: { lat: number; lng: number; name: string };
    destination: { lat: number; lng: number; name: string };
    departureTime: Date;
    travelMode: 'bike' | 'car' | 'bus';
  };

  const { searchRoute, loading: routeLoading } = useRoute();

  // Generate waypoints for weather data
  const waypoints = routeData ? [
    routeData.source,
    { lat: (routeData.source.lat + routeData.destination.lat) / 2, lng: (routeData.source.lng + routeData.destination.lng) / 2 },
    routeData.destination,
  ] : [];

  const { data: weatherData, isLoading: weatherLoading } = useRouteWeather(
    waypoints,
    routeData?.departureTime || new Date()
  );

  useEffect(() => {
    if (routeData) {
      // Search for route
      searchRoute({
        source: routeData.source.name,
        destination: routeData.destination.name,
        departureTime: routeData.departureTime,
        travelMode: routeData.travelMode,
      }).then((routeResult) => {
        if (routeResult) {
          setRoute(routeResult);
        }
      });
    }
  }, [routeData, searchRoute]);

  useEffect(() => {
    if (weatherData) {
      setWeatherPoints(weatherData);
    }
  }, [weatherData]);

  if (!routeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">No Route Data</h2>
          <p className="text-white/70 mb-6">
            Please go back and search for a route first.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const hasHighRiskWeather = weatherPoints.some(point => point.weather.rainProbability > 70);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {routeData.source.name} → {routeData.destination.name}
                </h1>
                <p className="text-white/60 text-sm">
                  {routeData.travelMode} • {routeData.departureTime.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'map'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Map className="w-4 h-4 inline mr-2" />
                Map
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <List className="w-4 h-4 inline mr-2" />
                Timeline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {routeLoading || weatherLoading ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/70">Loading route and weather data...</p>
                </div>
              </Card>
            ) : viewMode === 'map' ? (
              <RouteMap
                route={route}
                weatherPoints={weatherPoints}
                source={routeData.source}
                destination={routeData.destination}
              />
            ) : (
              <RouteTimeline points={weatherPoints} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Alerts */}
            {hasHighRiskWeather && (
              <WeatherAlerts weatherPoints={weatherPoints} />
            )}

            {/* Route Summary */}
            {route && (
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Route Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Distance:</span>
                    <span className="text-white font-medium">{route.totalDistance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white font-medium">{route.totalDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Travel Mode:</span>
                    <span className="text-white font-medium capitalize">{route.travelMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Departure:</span>
                    <span className="text-white font-medium">
                      {route.departureTime.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Arrival:</span>
                    <span className="text-white font-medium">
                      {route.arrivalTime.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Weather Summary */}
            {weatherPoints.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Weather Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Avg Temperature:</span>
                    <span className="text-white font-medium">
                      {Math.round(weatherPoints.reduce((sum, p) => sum + p.weather.temperature, 0) / weatherPoints.length)}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Max Rain Risk:</span>
                    <span className={`font-medium ${
                      Math.max(...weatherPoints.map(p => p.weather.rainProbability)) > 70 ? 'text-red-400' :
                      Math.max(...weatherPoints.map(p => p.weather.rainProbability)) > 40 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {Math.max(...weatherPoints.map(p => p.weather.rainProbability))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Min Visibility:</span>
                    <span className="text-white font-medium">
                      {Math.min(...weatherPoints.map(p => p.weather.visibility))} km
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePage;