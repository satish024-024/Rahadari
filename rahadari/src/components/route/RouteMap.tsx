import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Route } from '../../types/route';
import { WeatherPoint } from '../../types/weather';
import { Coordinate } from '../../types/route';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  route: Route | null;
  weatherPoints: WeatherPoint[];
  source: Coordinate;
  destination: Coordinate;
}

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const RouteMap: React.FC<RouteMapProps> = ({
  route,
  weatherPoints,
  source,
  destination,
}) => {
  const mapRef = useRef<any>(null);

  // Create custom icons
  const createWeatherIcon = (rainProbability: number) => {
    const color = rainProbability > 70 ? 'red' : rainProbability > 40 ? 'orange' : 'green';
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const sourceIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const destinationIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Calculate route polyline
  const routeCoordinates: [number, number][] = route?.waypoints?.map(point => [point.lat, point.lng]) || [
    [source.lat, source.lng],
    [destination.lat, destination.lng],
  ];

  // Get map center
  const center: [number, number] = [
    (source.lat + destination.lat) / 2,
    (source.lng + destination.lng) / 2,
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 h-96">
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Source Marker */}
        <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-green-600">Start</h3>
              <p className="text-sm">{source.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-red-600">End</h3>
              <p className="text-sm">{destination.name}</p>
            </div>
          </Popup>
        </Marker>

        {/* Weather Points */}
        {weatherPoints.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={createWeatherIcon(point.weather.rainProbability)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-2">{point.location}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium">{point.weather.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rain:</span>
                    <span className={`font-medium ${
                      point.weather.rainProbability > 70 ? 'text-red-600' :
                      point.weather.rainProbability > 40 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {point.weather.rainProbability}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind:</span>
                    <span className="font-medium">{point.weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility:</span>
                    <span className="font-medium">{point.weather.visibility} km</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <span className="text-xs text-gray-600">
                      {new Date(point.time).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Polyline */}
        <Polyline
          positions={routeCoordinates}
          color="#3b82f6"
          weight={4}
          opacity={0.8}
        />
      </MapContainer>
    </div>
  );
};