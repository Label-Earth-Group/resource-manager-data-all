import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet.chinatmsproviders';
import { tileLayer } from 'leaflet';

export function TianDiTuTileLayer() {
  const map = useMap();
  useEffect(() => {
    tileLayer
      .chinaProvider('TianDiTu.Normal.Map', {
        key: '331d1f3b55990949af7a50f8223c8e20',
        maxZoom: 18,
        minZoom: 1
      })
      .addTo(map);
  }, [map]);

  return <></>;
}
