import { useEffect, useRef, memo } from 'react';
import { useMap, TileLayer } from 'react-leaflet';
import { default as createStacObject } from 'stac-js';
import { stacGeometryLayer } from '../utils/stacLayer/stacLayer.js';
import { useGetItemAssetTileJsonQuery } from 'modules/PGSTAC/services/titilerApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from 'utils/utils.js';

export const StacGeometryLayer = memo(
  ({
    stacData,
    collectionStyle = undefined,
    options = undefined,
    highlightedItems = undefined,
    setHighlightedItems = undefined
  }) => {
    const map = useMap();
    const layerRef = useRef(null);

    // format the options
    const defaultOptions = {
      crossOrigin: '',
      //debugLevel: 2,
      displayOverview: false, //only display the spatial geometry
      //collectionStyle: stylePolygon, //the original stac-layer implementation would not work
      //set collectionStyle separately inside hooks
      boundsStyle: { stroke: false }
    };
    options = Object.assign(defaultOptions, options);

    // re-initialize the map only when stacData changes
    useEffect(() => {
      // Cleanup previous layer
      if (layerRef.current) {
        layerRef.current.removeFrom(map);
        setHighlightedItems && setHighlightedItems([]);
      }

      // Add stac layer
      function addStacLayer() {
        if (stacData) {
          const layer = stacGeometryLayer(stacData, options);
          if (layer) {
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
          setHighlightedItems && setHighlightedItems([]);
        }
      };
    }, [map, options, setHighlightedItems, stacData]);

    // manage the highlighted features
    useEffect(() => {
      // style differently for highlighted items
      const highlightStyle = {
        weight: 3,
        color: 'red',
        fillOpacity: 0.3
      };
      const defaultStyle = {
        weight: 1,
        color: 'blue',
        fillOpacity: 0.2
      };
      const styleFeatureFn = (item) => {
        item = createStacObject(item);
        if (highlightedItems && highlightedItems.some((i) => i.equals(item))) {
          return highlightStyle;
        } else {
          return defaultStyle;
        }
      };

      if (layerRef.current) {
        // set the layer style based on highlighted items
        const layer = layerRef.current;
        layer.eachLayer((l) =>
          l.setStyle(collectionStyle ? collectionStyle : styleFeatureFn)
        );
        layer.addTo(map);

        // set the clicked items to be highlighted
        setHighlightedItems &&
          layer.on('click', (event) => {
            const clicked = event.stac; //this is an array, could be multiple items
            setHighlightedItems(clicked);
          });
      }
    }, [map, highlightedItems, setHighlightedItems, collectionStyle]);

    return null;
  }
);

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
