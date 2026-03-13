import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
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
  const [locationInput, setLocationInput] = useState(value.address || '');

  const handleLocationInput = (address: string) => {
    setLocationInput(address);
    onChange({
      address: address,
      latitude: 0, // Set to 0 since we're not geocoding
      longitude: 0, // Set to 0 since we're not geocoding
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-search" className="text-sm font-medium text-foreground">
          {t('job_location')}
        </Label>
        <div className="mt-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="location-search"
              type="text"
              placeholder={t('enter_address_or_location')}
              value={locationInput}
              onChange={(e) => {
                handleLocationInput(e.target.value);
              }}
              className={`pl-10 ${error ? 'border-destructive' : ''}`}
            />
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>

    </div>
  );
};

export default LocationPickerSimple;
