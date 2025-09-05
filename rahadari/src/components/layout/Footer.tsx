import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Github, Twitter, Mail, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t('app.name')}</h3>
                <p className="text-sm text-white/60">{t('app.tagline')}</p>
              </div>
            </motion.div>
            <p className="text-white/70 text-sm max-w-md">
              {t('app.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t('navigation.home')}
                </a>
              </li>
              <li>
                <a href="/routes" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t('navigation.routes')}
                </a>
              </li>
              <li>
                <a href="/weather" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t('navigation.weather')}
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                  {t('navigation.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@rahadari.com"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between"
        >
          <p className="text-white/60 text-sm">
            © 2024 Rahadari. Made with <Heart className="w-4 h-4 text-red-400 inline mx-1" /> in India.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="text-white/60 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="/terms" className="text-white/60 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="/api" className="text-white/60 hover:text-white transition-colors text-sm">
              API Docs
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;