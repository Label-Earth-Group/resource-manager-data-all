import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported for leaflet
import 'leaflet-draw/dist/leaflet.draw.css'; // Ensure CSS is imported for leaflet-draw

const EditControl = ({ featureGroupRef, onGeometriesChange }) => {
  const map = useMap();

  useEffect(() => {
    const currentFeatureGroup = featureGroupRef.current;

    // Update geometries to reflect any changes
    // Note: the geometry data is passed in implicitly via featureGroupRef
    const updateGeometries = () => {
      const geometries = currentFeatureGroup.toGeoJSON();
      onGeometriesChange(geometries);
    };

    currentFeatureGroup.addTo(map);
    const drawControl = new L.Control.Draw({
      position: 'topright', // Position the control here
      draw: {
        polyline: false,
        rectangle: true,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: true
      },
      edit: {
        featureGroup: currentFeatureGroup,
        edit: true,
        remove: true
      }
    });

    map.addControl(drawControl);

    const onCreate = (e) => {
      const { layer } = e;
      currentFeatureGroup.addLayer(layer);
      updateGeometries();
    };

    const onEditOrDelete = () => {
      updateGeometries();
    };

    // Subscribe to draw, edit, and delete events
    map.on(L.Draw.Event.CREATED, onCreate);
    map.on(L.Draw.Event.EDITED, onEditOrDelete);
    map.on(L.Draw.Event.DELETED, onEditOrDelete);

    return () => {
      // Cleanup on component unmount
      map.off(L.Draw.Event.CREATED, onCreate);
      map.off(L.Draw.Event.EDITED, onEditOrDelete);
      map.off(L.Draw.Event.DELETED, onEditOrDelete);

      map.removeControl(drawControl);
      currentFeatureGroup.clearLayers();
    };
  }, [map, onGeometriesChange, featureGroupRef]); // Re-run effect if the map object changes

  return null;
};

export function MapComponent({
  spatialExtent,
  onSpatialExtentChange,
  children
}) {
  const mapRef = useRef(null);
  const featureGroupRef = useRef(new L.FeatureGroup());

  // This effect updates the map layers with new input geometries in props
  useEffect(() => {
    featureGroupRef.current.clearLayers();
    L.geoJSON(spatialExtent, {
      onEachFeature: (feature, layer) => featureGroupRef.current.addLayer(layer)
    });
  }, [spatialExtent]); // Re-run effect if geometries prop changes

  return (
    <MapContainer
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
      center={[40, 120]}
      zoom={8}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
      // style={{ height: `calc(100vh - ${headerHight}px)` }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <EditControl
        featureGroupRef={featureGroupRef}
        onGeometriesChange={onSpatialExtentChange}
      />
      {children && children}
    </MapContainer>
  );
}
