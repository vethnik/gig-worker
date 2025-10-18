import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  error?: string;
}

// Component to handle map clicks and marker dragging
const MapEvents = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(value.address || '');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Geocoding function using Nominatim (free alternative to Google Maps)
  const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          address: result.display_name,
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const result = await geocodeAddress(searchQuery);
    
    if (result) {
      onChange(result);
      setSearchQuery(result.address);
      
      // Center map on the new location
      if (mapRef.current) {
        mapRef.current.setView([result.latitude, result.longitude], 15);
      }
    } else {
      // Handle search failure - could show a toast here
      console.error('Location not found');
    }
    
    setIsSearching(false);
  };

  const handleMapLocationChange = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    const newLocation: LocationData = {
      address,
      latitude: lat,
      longitude: lng,
    };
    
    onChange(newLocation);
    setSearchQuery(address);
  };

  const handleMarkerDrag = (e: L.DragEndEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    handleMapLocationChange(position.lat, position.lng);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Default location (you can change this to your preferred default)
  const defaultCenter: [number, number] = value.latitude && value.longitude 
    ? [value.latitude, value.longitude] 
    : [28.6139, 77.2090]; // Delhi, India

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-search" className="text-sm font-medium text-foreground">
          {t('job_location')}
        </Label>
        <div className="flex gap-2 mt-1">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="location-search"
              type="text"
              placeholder={t('enter_address_or_location')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`pl-10 ${error ? 'border-destructive' : ''}`}
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            size="icon"
            variant="outline"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>

      {/* Map Container */}
      <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {value.latitude && value.longitude && (
            <Marker
              position={[value.latitude, value.longitude]}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDrag,
              }}
            />
          )}
          
          <MapEvents onLocationChange={handleMapLocationChange} />
        </MapContainer>
      </div>

      {/* Location Details */}
      {value.latitude && value.longitude && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium">{t('selected_location')}:</p>
          <p className="truncate">{value.address}</p>
          <p className="text-xs mt-1">
            {t('coordinates')}: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">{t('how_to_use')}:</p>
        <ul className="space-y-1 text-blue-600 dark:text-blue-400">
          <li>• {t('type_address_and_search')}</li>
          <li>• {t('click_map_to_set_location')}</li>
          <li>• {t('drag_marker_to_adjust')}</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationPicker;
