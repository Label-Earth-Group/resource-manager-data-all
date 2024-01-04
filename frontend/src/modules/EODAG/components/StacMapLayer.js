import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import stacLayer from 'stac-layer';

export const StacGeometryMapLayer = ({ stacData }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    async function addStacLayer() {
      // Cleanup previous layer
      if (layerRef.current) {
        layerRef.current.removeFrom(map);
      }

      const options = {
        resolution: 128,
        crossOrigin: '',
        //debugLevel: 2,
        displayOverview: false, //only display the spatial geometry
        collectionStyle: { fillOpacity: 1, color: 'red' }, //this would not work, and it is a bug of stac-layer
        boundsStyle: { stroke: false }
      };

      if (stacData) {
        const layer = await stacLayer(stacData, options);
        if (layer) {
          console.log('stac layer object', layer);
          layer.addTo(map);
          map.fitBounds(layer.getBounds());
          layerRef.current = layer; // Store the reference to the current layer
        }
      }
    }

    addStacLayer();

    // Cleanup function for useEffect
    return () => {
      if (layerRef.current) {
        layerRef.current.removeFrom(map);
      }
    };
  }, [map, stacData]); // Dependency array

  return null;
};
