import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const PIN_ICON = L.divIcon({
  html: `<svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" width="28" height="42">
    <path fill="#3D9E3D" stroke="white" stroke-width="1.5"
      d="M12 1C7.03 1 3 5.03 3 10c0 7.25 9 25 9 25S21 17.25 21 10c0-4.97-4.03-9-9-9z"/>
    <circle cx="12" cy="10" r="3.5" fill="white"/>
  </svg>`,
  className: '',
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

const ALMATY: [number, number] = [43.238949, 76.889709];

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

interface OsmMapPickerProps {
  onSave: (lat: number, lon: number) => void;
  isSaving: boolean;
  initialPosition?: [number, number] | null;
}

export function OsmMapPicker({ onSave, isSaving, initialPosition }: OsmMapPickerProps) {
  const { t } = useTranslation();
  const [position, setPosition] = useState<[number, number] | null>(initialPosition ?? null);

  const handlePick = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
  }, []);

  return (
    <div className="space-y-3">
      {/* Map */}
      <div className="relative rounded-2xl border border-surface-border" style={{ height: 320 }}>
        {!position && (
          <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
            <div className="rounded-xl bg-white/90 px-4 py-2.5 text-center shadow-lg backdrop-blur-sm">
              <p className="text-sm font-semibold text-ink">{t('organization.locationClickHint')}</p>
              <p className="mt-0.5 text-xs text-faint">{t('organization.locationClickSub')}</p>
            </div>
          </div>
        )}

        <MapContainer
          center={initialPosition ?? ALMATY}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: 320, width: '100%', borderRadius: '1rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handlePick} />
          {position && <Marker position={position} icon={PIN_ICON} />}
        </MapContainer>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-surface-border bg-surface-card px-4 py-3">
        {position ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <svg className="h-3.5 w-3.5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-mono text-sm text-ink truncate">
              {position[0].toFixed(5)}, {position[1].toFixed(5)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-faint">{t('organization.locationNone')}</span>
        )}

        <button
          onClick={() => position && onSave(position[0], position[1])}
          disabled={!position || isSaving}
          className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-neon-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {t('organization.saveLocation')}
        </button>
      </div>
    </div>
  );
}
