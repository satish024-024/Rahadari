import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Navigation, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { NominatimService } from '../../services/geocoding/nominatimService';
import { useGeocoding, useCurrentLocation } from '../../hooks/useRoute';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import toast from 'react-hot-toast';

export const RouteSearchCard: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [travelMode, setTravelMode] = useState<'bike' | 'car' | 'bus'>('car');
  const [sourceSuggestions, setSourceSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSource = useDebounce(source, 500);
  const debouncedDest = useDebounce(destination, 500);
  
  const { search: searchSource, suggestions: sourceResults, loading: sourceLoading } = useGeocoding();
  const { search: searchDest, suggestions: destResults, loading: destLoading } = useGeocoding();
  const { getCurrentLocation, location, loading: locationLoading } = useCurrentLocation();

  useEffect(() => {
    if (debouncedSource.length > 2) {
      searchSource(debouncedSource);
      setSourceSuggestions(sourceResults);
    } else {
      setSourceSuggestions([]);
    }
  }, [debouncedSource, sourceResults]);

  useEffect(() => {
    if (debouncedDest.length > 2) {
      searchDest(debouncedDest);
      setDestSuggestions(destResults);
    } else {
      setDestSuggestions([]);
    }
  }, [debouncedDest, destResults]);

  const handleSearch = async () => {
    if (!source || !destination) {
      toast.error('Please enter both source and destination');
      return;
    }

    setIsSearching(true);
    try {
      const geocoder = new NominatimService();
      const [sourceCoords, destCoords] = await Promise.all([
        geocoder.getCoordinates(source),
        geocoder.getCoordinates(destination),
      ]);

      navigate('/route', {
        state: {
          source: { ...sourceCoords, name: source },
          destination: { ...destCoords, name: destination },
          departureTime: new Date(departureTime),
          travelMode,
        },
      });
    } catch (error) {
      toast.error('Failed to find locations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  useEffect(() => {
    if (location) {
      setSource(location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    }
  }, [location]);

  return (
    <Card className="w-full max-w-2xl mx-auto" padding="lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Plan Your Journey
          </h2>
          <p className="text-gray-300">
            Get weather-aware route planning across India
          </p>
        </div>

        {/* Source Input */}
        <div className="relative">
          <Input
            label="Starting Point"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter starting location..."
            icon={<MapPin className="w-5 h-5" />}
            rightIcon={
              <button
                onClick={handleCurrentLocation}
                disabled={locationLoading}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                title="Use current location"
              >
                <Navigation className="w-4 h-4 text-blue-400" />
              </button>
            }
          />
          
          {/* Source Suggestions Dropdown */}
          <AnimatePresence>
            {sourceSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700"
              >
                {sourceSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSource(suggestion.display_name);
                      setSourceSuggestions([]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-gray-200 text-sm border-b border-gray-700 last:border-0"
                  >
                    {suggestion.display_name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Destination Input */}
        <div className="relative">
          <Input
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination..."
            icon={<MapPin className="w-5 h-5" />}
          />
          
          {/* Destination Suggestions */}
          <AnimatePresence>
            {destSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700"
              >
                {destSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDestination(suggestion.display_name);
                      setDestSuggestions([]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-gray-200 text-sm border-b border-gray-700 last:border-0"
                  >
                    {suggestion.display_name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time and Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Departure Time"
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            icon={<Clock className="w-5 h-5" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Travel Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['bike', 'car', 'bus'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTravelMode(mode)}
                  className={`py-3 rounded-xl font-medium capitalize transition-all ${
                    travelMode === mode
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {mode === 'bike' ? '🏍️' : mode === 'car' ? '🚗' : '🚌'} {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          loading={isSearching}
          icon={<Search className="w-5 h-5" />}
          className="w-full"
          size="lg"
        >
          {isSearching ? 'Searching routes...' : 'Check Weather & Routes'}
        </Button>
      </div>
    </Card>
  );
};