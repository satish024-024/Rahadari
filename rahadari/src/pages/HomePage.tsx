import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RouteSearchCard } from '../components/home/RouteSearchCard';
import QuickRoutes from '../components/home/QuickRoutes';
import LiveWeatherTicker from '../components/home/LiveWeatherTicker';
import HeroSection from '../components/home/HeroSection';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Search - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <RouteSearchCard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Routes */}
            <QuickRoutes />
            
            {/* Live Weather Ticker */}
            <LiveWeatherTicker />
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Rahadari?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Get accurate weather forecasts and optimal route planning for your journey across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌦️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-time Weather
              </h3>
              <p className="text-white/70 text-sm">
                Get accurate weather forecasts for every point along your route with multiple data sources
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Smart Routing
              </h3>
              <p className="text-white/70 text-sm">
                Find the best routes considering weather conditions, traffic, and road safety
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Instant Updates
              </h3>
              <p className="text-white/70 text-sm">
                Receive real-time weather alerts and route updates to ensure safe travel
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Plan Your Journey?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Start planning your route with weather-aware navigation. Get the most accurate forecasts and safest routes for your travel across India.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                const input = document.querySelector('input[placeholder*="starting location"]') as HTMLInputElement;
                input?.focus();
              }}
            >
              Start Planning Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;