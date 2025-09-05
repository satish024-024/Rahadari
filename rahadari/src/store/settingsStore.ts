import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'hi' | 'te';
  notifications: {
    weatherAlerts: boolean;
    routeUpdates: boolean;
    trafficUpdates: boolean;
  };
  mapSettings: {
    showTraffic: boolean;
    showWeather: boolean;
    showPOI: boolean;
    defaultZoom: number;
  };
  weatherSettings: {
    updateInterval: number; // minutes
    showDetailedForecast: boolean;
    showRadar: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareWeatherData: boolean;
    analytics: boolean;
  };
  setTheme: (theme: SettingsState['theme']) => void;
  setLanguage: (language: SettingsState['language']) => void;
  updateNotifications: (notifications: Partial<SettingsState['notifications']>) => void;
  updateMapSettings: (settings: Partial<SettingsState['mapSettings']>) => void;
  updateWeatherSettings: (settings: Partial<SettingsState['weatherSettings']>) => void;
  updatePrivacy: (privacy: Partial<SettingsState['privacy']>) => void;
  resetSettings: () => void;
}

const defaultSettings: Omit<SettingsState, 
  'setTheme' | 'setLanguage' | 'updateNotifications' | 'updateMapSettings' | 
  'updateWeatherSettings' | 'updatePrivacy' | 'resetSettings'
> = {
  theme: 'auto',
  language: 'en',
  notifications: {
    weatherAlerts: true,
    routeUpdates: true,
    trafficUpdates: false,
  },
  mapSettings: {
    showTraffic: true,
    showWeather: true,
    showPOI: true,
    defaultZoom: 10,
  },
  weatherSettings: {
    updateInterval: 15,
    showDetailedForecast: true,
    showRadar: true,
  },
  privacy: {
    shareLocation: false,
    shareWeatherData: false,
    analytics: true,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      updateNotifications: (notifications) => {
        const { notifications: current } = get();
        set({ 
          notifications: { ...current, ...notifications } 
        });
      },

      updateMapSettings: (settings) => {
        const { mapSettings: current } = get();
        set({ 
          mapSettings: { ...current, ...settings } 
        });
      },

      updateWeatherSettings: (settings) => {
        const { weatherSettings: current } = get();
        set({ 
          weatherSettings: { ...current, ...settings } 
        });
      },

      updatePrivacy: (privacy) => {
        const { privacy: current } = get();
        set({ 
          privacy: { ...current, ...privacy } 
        });
      },

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'rahadari-settings-storage',
    }
  )
);