import React, { useState } from 'react';
import { MapContainer, FeatureGroup } from 'react-leaflet';
import TianDiTuTileLayer from './TianDiTuTileLayer';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export const LeafletMapComponent = () => {
  const [drawnItems, setDrawnItems] = useState([]);
  console.log(drawnItems);

  const onCreated = (e) => {
    const { layerType, layer } = e;

    if (layerType === 'polygon' || layerType === 'rectangle') {
      const shape = layer.toGeoJSON();
      setDrawnItems((items) => [...items, shape]);
    }
  };

  return (
    <MapContainer
      scrollWheelZoom={true}
      id="map"
      center={[50.0, 0.0]}
      zoom={1}
      style={{ height: '400px' }}
    >
      <TianDiTuTileLayer />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polygon: true,
            rectangle: true
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};
