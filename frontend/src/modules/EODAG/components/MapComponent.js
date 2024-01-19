import React, { useRef, useEffect } from 'react';
import { MapContainer, FeatureGroup, TileLayer } from 'react-leaflet';
import { StacGeometryLayer } from './StacMapLayer';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export const LeafletMapComponent = ({
  drawnItems,
  setDrawnItems,
  stacDataForDisplay,
  highlightedItems = undefined,
  setHighlightedItems = undefined
}) => {
  const featureGroupRef = useRef();
  console.log('featureGroupRef', featureGroupRef.current);

  // Effect to synchronize the drawn items with the FeatureGroup layers
  useEffect(() => {
    console.log('drawn items changed');
    const featureGroup = featureGroupRef.current;
    if (featureGroup) {
      console.log('feature group', featureGroup);
      featureGroup.clearLayers(); // Clear existing layers
      drawnItems.forEach((item) => {
        // Add each drawn item to the feature group
        item.addTo(featureGroup);
      });
    }
  }, [drawnItems]); // Re-run this effect when drawnItems changes

  // the edit control handlers
  const onCreated = (e) => {
    const { layer } = e;
    const newShape = layer;

    // Clear existing drawn items before adding the new one
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stacDataForDisplay && (
        <StacGeometryLayer
          stacData={stacDataForDisplay}
          highlightedItems={highlightedItems}
          setHighlightedItems={setHighlightedItems}
        ></StacGeometryLayer>
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
