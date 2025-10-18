import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerSimpleProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  error?: string;
}

const LocationPickerSimple: React.FC<LocationPickerSimpleProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(value.address || '');
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const result = await geocodeAddress(searchQuery);
    
    if (result) {
      onChange(result);
      setSearchQuery(result.address);
    } else {
      // Handle search failure
      console.error('Location not found');
    }
    
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleManualInput = (address: string) => {
    setSearchQuery(address);
    // For manual input, we'll use a default coordinate or let user search
    onChange({
      address: address,
      latitude: value.latitude || 0,
      longitude: value.longitude || 0,
    });
  };

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleManualInput(e.target.value);
              }}
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

      {/* Location Details */}
      {value.latitude !== 0 && value.longitude !== 0 && (
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
          <li>• Manual entry is also supported</li>
          <li>• Click search to get exact coordinates</li>
        </ul>
      </div>

      {/* Note about map */}
      <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="font-medium mb-1">📍 Note:</p>
        <p>Interactive map view will be available soon. For now, you can enter the address and click search to get coordinates.</p>
      </div>
    </div>
  );
};

export default LocationPickerSimple;
