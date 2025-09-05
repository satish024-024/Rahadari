import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData, WeatherAlert } from '../types/weather';

interface WeatherState {
  currentWeather: WeatherData | null;
  weatherAlerts: WeatherAlert[];
  weatherHistory: WeatherData[];
  preferredUnits: {
    temperature: 'celsius' | 'fahrenheit';
    distance: 'km' | 'miles';
    speed: 'kmh' | 'mph';
  };
  setCurrentWeather: (weather: WeatherData | null) => void;
  addWeatherAlert: (alert: WeatherAlert) => void;
  removeWeatherAlert: (alertId: string) => void;
  clearWeatherAlerts: () => void;
  addToHistory: (weather: WeatherData) => void;
  setPreferredUnits: (units: Partial<WeatherState['preferredUnits']>) => void;
  clearHistory: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      currentWeather: null,
      weatherAlerts: [],
      weatherHistory: [],
      preferredUnits: {
        temperature: 'celsius',
        distance: 'km',
        speed: 'kmh',
      },

      setCurrentWeather: (weather) => set({ currentWeather: weather }),

      addWeatherAlert: (alert) => {
        const { weatherAlerts } = get();
        const exists = weatherAlerts.some(a => a.id === alert.id);
        
        if (!exists) {
          set({ weatherAlerts: [...weatherAlerts, alert] });
        }
      },

      removeWeatherAlert: (alertId) => {
        const { weatherAlerts } = get();
        set({ 
          weatherAlerts: weatherAlerts.filter(a => a.id !== alertId) 
        });
      },

      clearWeatherAlerts: () => set({ weatherAlerts: [] }),

      addToHistory: (weather) => {
        const { weatherHistory } = get();
        const newHistory = [weather, ...weatherHistory].slice(0, 100); // Keep last 100 entries
        set({ weatherHistory: newHistory });
      },

      setPreferredUnits: (units) => {
        const { preferredUnits } = get();
        set({ 
          preferredUnits: { ...preferredUnits, ...units } 
        });
      },

      clearHistory: () => set({ weatherHistory: [] }),
    }),
    {
      name: 'rahadari-weather-storage',
      partialize: (state) => ({
        weatherHistory: state.weatherHistory,
        preferredUnits: state.preferredUnits,
      }),
    }
  )
);