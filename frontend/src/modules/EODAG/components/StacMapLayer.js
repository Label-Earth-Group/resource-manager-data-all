import { useEffect, useRef } from 'react';
import { useMap, TileLayer } from 'react-leaflet';
import stacLayer from 'stac-layer';
import { useGetItemAssetTileJsonQuery } from 'modules/PGSTAC/services/titilerApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';

export const StacGeometryLayer = ({ stacData, options }) => {
  const map = useMap();
  const layerRef = useRef(null);

  const defaultOptions = {
    resolution: 128,
    crossOrigin: '',
    //debugLevel: 2,
    displayOverview: false, //only display the spatial geometry
    collectionStyle: { fillOpacity: 1, color: 'red' }, //this would not work, and it is a bug of stac-layer
    boundsStyle: { stroke: false }
  };
  options = Object.assign({}, defaultOptions, options);

  useEffect(() => {
    async function addStacLayer() {
      // Cleanup previous layer
      if (layerRef.current) {
        layerRef.current.removeFrom(map);
      }

      if (stacData) {
        const layer = await stacLayer(stacData, options);
        if (layer) {
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
  }, [map, options, stacData]); // Dependency array

  return null;
};

export const ItemTitilerLayer = (props) => {
  const { collectionID, itemID, assets, params } = props;
  const dispatch = useDispatch();

  const { data: tileJson, error } = useGetItemAssetTileJsonQuery({
    collectionID,
    itemID,
    assets,
    params
  });
  useHandleError(error, dispatch);

  if (tileJson && !error) {
    const tileURL = tileJson?.tiles[0];
    const bounds = tileJson?.bounds
      ? [
          [tileJson.bounds[1], tileJson.bounds[0]], // Southwest coordinates
          [tileJson.bounds[3], tileJson.bounds[2]] // Northeast coordinates
        ]
      : null;

    return <TileLayer url={tileURL} bounds={bounds} />;
  }
};
