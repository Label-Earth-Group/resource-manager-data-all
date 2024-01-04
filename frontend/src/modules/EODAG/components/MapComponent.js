import React, { useRef } from 'react';
import { MapContainer, FeatureGroup } from 'react-leaflet';
import TianDiTuTileLayer from './TianDiTuTileLayer';
import { StacGeometryMapLayer } from './StacMapLayer';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export const LeafletMapComponent = ({ setDrawnItems, stacDataForDisplay }) => {
  const featureGroupRef = useRef();

  const onCreated = (e) => {
    const { layer } = e;
    const newShape = layer;

    // // Clear existing drawn items before adding the new one
    // const layers = featureGroupRef.current;
    // layers.clearLayers();

    setDrawnItems((items) => [...items, newShape]);
  };

  const onEdited = (e) => {
    //const layers = featureGroupRef.current;
    const editedShapes = [];
    e.layers.eachLayer((layer) => {
      editedShapes.push(layer);
    });

    setDrawnItems((currentItems) =>
      currentItems.map(
        (item) => editedShapes.find((shape) => shape.id === item.id) || item
      )
    );
  };

  const onDeleted = (e) => {
    const deletedIds = Object.keys(e.layers._layers);
    setDrawnItems((currentItems) =>
      currentItems.filter(
        (item) => !deletedIds.includes(item._leaflet_id.toString())
      )
    );
  };

  return (
    <MapContainer
      scrollWheelZoom={true}
      center={[50.0, 0.0]}
      zoom={1}
      style={{ height: '100%' }}
    >
      <TianDiTuTileLayer />
      {stacDataForDisplay && (
        <StacGeometryMapLayer
          stacData={stacDataForDisplay}
        ></StacGeometryMapLayer>
      )}
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          onEdited={onEdited}
          onDeleted={onDeleted}
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
