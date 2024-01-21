import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react';
import {
  MapContainer,
  FeatureGroup,
  TileLayer,
  ZoomControl
} from 'react-leaflet';
import { StacGeometryLayer } from './StacMapLayer';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

export const LeafletMapComponent = forwardRef((props, ref) => {
  const {
    drawnItems,
    setDrawnItems,
    stacDataForDisplay,
    children,
    highlightedItems,
    setHighlightedItems
  } = props;
  const mapRef = useRef();
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

  // expose some methods to parent components
  useImperativeHandle(ref, () => ({
    fitBoundsToItem: (item) => {
      if (item && mapRef.current) {
        mapRef.current.fitBounds(item.getBounds());
      }
    }
  }));

  return (
    <MapContainer
      ref={mapRef}
      scrollWheelZoom={true}
      center={[40, 120]}
      zoom={8}
      style={{ height: '100%' }}
      zoomControl={false}
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
      <ZoomControl position="topright" />
      {children && children}
    </MapContainer>
  );
});
