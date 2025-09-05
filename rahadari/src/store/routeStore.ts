import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Route, RouteSearchParams, Coordinate } from '../types/route';

interface RouteState {
  currentRoute: Route | null;
  searchHistory: RouteSearchParams[];
  favoriteRoutes: Route[];
  recentSearches: string[];
  setCurrentRoute: (route: Route | null) => void;
  addToHistory: (search: RouteSearchParams) => void;
  addToFavorites: (route: Route) => void;
  removeFromFavorites: (routeId: string) => void;
  addRecentSearch: (search: string) => void;
  clearHistory: () => void;
  clearFavorites: () => void;
  clearRecentSearches: () => void;
}

export const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      currentRoute: null,
      searchHistory: [],
      favoriteRoutes: [],
      recentSearches: [],

      setCurrentRoute: (route) => set({ currentRoute: route }),

      addToHistory: (search) => {
        const { searchHistory } = get();
        const newHistory = [search, ...searchHistory.filter(s => 
          !(s.source === search.source && s.destination === search.destination)
        )].slice(0, 10); // Keep only last 10 searches
        
        set({ searchHistory: newHistory });
      },

      addToFavorites: (route) => {
        const { favoriteRoutes } = get();
        const exists = favoriteRoutes.some(r => r.id === route.id);
        
        if (!exists) {
          set({ favoriteRoutes: [...favoriteRoutes, route] });
        }
      },

      removeFromFavorites: (routeId) => {
        const { favoriteRoutes } = get();
        set({ 
          favoriteRoutes: favoriteRoutes.filter(r => r.id !== routeId) 
        });
      },

      addRecentSearch: (search) => {
        const { recentSearches } = get();
        const newSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 20);
        set({ recentSearches: newSearches });
      },

      clearHistory: () => set({ searchHistory: [] }),
      clearFavorites: () => set({ favoriteRoutes: [] }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'rahadari-route-storage',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        favoriteRoutes: state.favoriteRoutes,
        recentSearches: state.recentSearches,
      }),
    }
  )
);