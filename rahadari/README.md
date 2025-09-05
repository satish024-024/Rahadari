# 🌦️ Rahadari - Weather-Integrated Route Planner

A modern, production-ready web application that combines real-time weather forecasting with intelligent route planning for travelers across India.

## ✨ Features

### 🗺️ Smart Route Planning
- **Real-time routing** with OpenRouteService integration
- **Multiple travel modes**: Bike, Car, Bus
- **Alternative routes** with weather-aware recommendations
- **Interactive maps** with Leaflet integration

### 🌦️ Advanced Weather Integration
- **Multi-source weather data** from OpenWeatherMap, OpenMeteo, and WeatherAPI
- **Hyperlocal forecasts** for every point along your route
- **Weather timeline** showing conditions throughout your journey
- **Real-time alerts** for dangerous weather conditions

### 🎨 Modern UI/UX
- **Glass morphism design** with beautiful animations
- **Responsive layout** optimized for mobile and desktop
- **Dark/Light theme** support with system preference detection
- **Progressive Web App** with offline capabilities

### 🌍 Multi-language Support
- **English, Hindi, and Telugu** language support
- **RTL-ready** for future language additions
- **Localized weather data** and route information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for weather and routing services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rahadari.git
   cd rahadari
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_key
   VITE_OPENROUTE_API_KEY=your_openroute_key
   VITE_WEATHERAPI_KEY=your_weatherapi_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### Required APIs (Free Tiers Available)

1. **OpenWeatherMap** - [Get API Key](https://openweathermap.org/api)
   - 1,000 calls/day free
   - Current weather and forecasts

2. **OpenRouteService** - [Get API Key](https://openrouteservice.org/dev/#/signup)
   - 2,000 requests/day free
   - Routing and geocoding

3. **WeatherAPI** - [Get API Key](https://www.weatherapi.com/)
   - 1,000,000 calls/month free
   - Backup weather data

### Optional APIs

4. **OpenMeteo** - No API key required
   - Completely free weather data
   - Used as fallback service

5. **Nominatim** - No API key required
   - Free geocoding service
   - Address search and reverse geocoding

## 🏗️ Project Structure

```
rahadari/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── home/          # Homepage components
│   │   ├── route/         # Route planning components
│   │   ├── weather/       # Weather display components
│   │   └── ui/            # Reusable UI components
│   ├── services/          # API services
│   │   ├── weather/       # Weather API integrations
│   │   ├── routing/       # Routing API integrations
│   │   ├── geocoding/     # Geocoding services
│   │   └── cache/         # Caching utilities
│   ├── hooks/             # Custom React hooks
│   ├── store/             # State management (Zustand)
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── styles/            # CSS and styling
│   └── i18n/              # Internationalization
├── .env.example           # Environment variables template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Leaflet** for maps
- **React Query** for data fetching
- **Zustand** for state management

### APIs & Services
- **OpenWeatherMap** - Primary weather data
- **OpenRouteService** - Routing and geocoding
- **WeatherAPI** - Backup weather data
- **OpenMeteo** - Free weather data
- **Nominatim** - Free geocoding

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **PWA** support with service workers

## 📱 Progressive Web App

Rahadari is a fully functional PWA with:
- **Offline support** for cached routes and weather data
- **Installable** on mobile and desktop
- **Push notifications** for weather alerts
- **Background sync** for data updates

## 🌍 Internationalization

Currently supports:
- **English** (en)
- **Hindi** (hi) 
- **Telugu** (te)

Adding new languages is straightforward - just add translation files in `src/i18n/`.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t rahadari .
docker run -p 3000:3000 rahadari
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data
- **OpenRouteService** for routing data
- **OpenStreetMap** for map tiles
- **Leaflet** for map functionality
- **React** and **Vite** communities

## 📞 Support

- **Documentation**: [docs.rahadari.com](https://docs.rahadari.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/rahadari/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/rahadari/discussions)
- **Email**: support@rahadari.com

## 🗺️ Roadmap

- [ ] **Voice navigation** with weather alerts
- [ ] **AR weather visualization**
- [ ] **Community weather reports**
- [ ] **Fuel station integration**
- [ ] **Traffic data integration**
- [ ] **Multi-modal route planning**
- [ ] **Weather prediction ML models**

---

Made with ❤️ in India for safe and weather-aware travel across the country.