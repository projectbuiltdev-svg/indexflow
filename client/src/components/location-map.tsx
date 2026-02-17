import { MapPin } from "lucide-react";

export interface LocationMapProps {
  city?: string;
  latitude?: number;
  longitude?: number;
  className?: string;
}

export function LocationMap({ city, latitude, longitude, className }: LocationMapProps) {
  const mapUrl = latitude && longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05}%2C${latitude - 0.03}%2C${longitude + 0.05}%2C${latitude + 0.03}&layer=mapnik&marker=${latitude}%2C${longitude}`
    : null;

  return (
    <div className={`bg-muted rounded-lg overflow-hidden ${className || 'h-64'}`} data-testid="location-map">
      {mapUrl ? (
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          title={city ? `Map of ${city}` : 'Location Map'}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{city ? `${city} Area` : 'Service Area Map'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationMap;
