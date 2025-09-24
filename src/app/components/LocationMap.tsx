"use client";
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Icon } from '@iconify/react';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Location {
  lat: number;
  lng: number;
  placeName?: string;
}

interface LocationMapProps {
  location: Location;
  height?: string;
  width?: string;
  className?: string;
  showPopup?: boolean;
  popupContent?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  location,
  height = "200px",
  width = "100%",
  className = "",
  showPopup = true,
  popupContent
}) => {
  // Fix Leaflet default icon paths
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      try {
        // @ts-ignore
        delete (window as any).L.Icon.Default.prototype._getIconUrl;
        // @ts-ignore
        (window as any).L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      } catch (error) {
        console.warn('Failed to configure Leaflet icons:', error);
      }
    }
  }, []);

  // Don't render if location is invalid
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height, width }}
      >
        <div className="text-center text-gray-500">
          <Icon icon="lucide:map-pin" className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No location data</p>
        </div>
      </div>
    );
  }

  const defaultPopupContent = popupContent || location.placeName || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height, width }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          {showPopup && (
            <Popup>
              <div className="p-2">
                <p className="font-medium text-gray-900">{defaultPopupContent}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;
