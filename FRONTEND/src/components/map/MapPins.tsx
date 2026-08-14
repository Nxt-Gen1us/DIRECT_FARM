import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MapPin } from "../../lib/map/types";
import { pinIcon } from "./pinIcon";

export function MapPins({
  pins,
  selectedId,
  onSelect,
}: {
  pins: MapPin[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.position.lat, pin.position.lng]}
          icon={pinIcon(pin.kind, pin.id === selectedId)}
          eventHandlers={{ click: () => onSelect?.(pin.id) }}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="text-[10px] uppercase tracking-wider text-muted">{t(`atlas.kind.${pin.kind}`)}</p>
              <p className="font-medium text-ink">{pin.title}</p>
              {pin.subtitle && <p className="text-xs text-ink-soft">{pin.subtitle}</p>}
              {pin.km != null && <p className="mt-1 text-[11px] text-primary">{pin.km} km</p>}
              {pin.href && (
                <Link to={pin.href} className="mt-1 inline-block text-xs text-primary">
                  {t("common.open")} →
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
