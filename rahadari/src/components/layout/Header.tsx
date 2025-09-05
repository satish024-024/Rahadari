import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Menu, X, Settings, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useTranslation();
  const { language, setLanguage, theme, setTheme } = useSettingsStore();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ];

  const themes = [
    { code: 'light', name: 'Light', icon: '☀️' },
    { code: 'dark', name: 'Dark', icon: '🌙' },
    { code: 'auto', name: 'Auto', icon: '🔄' },
  ];

  return (
    <>
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t('app.name')}</h1>
                <p className="text-xs text-white/60">{t('app.tagline')}</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-white/80 hover:text-white transition-colors">
                {t('navigation.home')}
              </a>
              <a href="/routes" className="text-white/80 hover:text-white transition-colors">
                {t('navigation.routes')}
              </a>
              <a href="/weather" className="text-white/80 hover:text-white transition-colors">
                {t('navigation.weather')}
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'te')}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                icon={<Settings className="w-4 h-4" />}
              >
                Settings
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                icon={isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                className="md:hidden"
              >
                Menu
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="py-4 space-y-2">
              <a
                href="/"
                className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.home')}
              </a>
              <a
                href="/routes"
                className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.routes')}
              </a>
              <a
                href="/weather"
                className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.weather')}
              </a>
            </nav>
          </motion.div>
        </div>
      </header>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings"
        size="md"
      >
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.code}
                  onClick={() => setTheme(themeOption.code as 'light' | 'dark' | 'auto')}
                  className={`p-3 rounded-lg border transition-all ${
                    theme === themeOption.code
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{themeOption.icon}</div>
                  <div className="text-sm font-medium">{themeOption.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Language
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'te')}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    language === lang.code
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;