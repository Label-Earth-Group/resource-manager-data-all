import L from 'leaflet';

import { default as createStacObject, STAC, Catalog } from 'stac-js';
import { isBoundingBox } from 'stac-js/src/geo.js';
import {
  enableLogging,
  flushEventQueue,
  log,
  registerEvents
} from './events.js';
import { addLayer } from './add.js';

// Data must be: Catalog, Collection, Item, API Items, or API Collections
export const stacGeometryLayer = (data, options = {}) => {
  if (!data) {
    throw new Error('No data provided');
  }

  options = Object.assign(
    {
      // defaults:
      debugLevel: 0
    },
    options
  ); // shallow clone options

  enableLogging(options.debugLevel);

  log(1, 'starting');

  // Convert to stac-js and set baseUrl
  if (!(data instanceof STAC)) {
    data = createStacObject(data);
    if (options.baseUrl) {
      data.setAbsoluteUrl(options.baseUrl);
    }
  }
  log(2, 'data:', data);
  log(2, 'url:', data.getAbsoluteUrl());

  if (data instanceof Catalog) {
    log(1, "Catalogs don't have spatial information, you may see an empty map");
  }

  if (options.bbox && !isBoundingBox(options.bbox)) {
    log(1, 'The provided bbox is invalid');
  }

  if (
    !(options.collectionStyle && typeof options.collectionStyle === 'function')
  ) {
    options.collectionStyle = Object.assign(
      {
        fillOpacity: 0,
        weight: 1,
        color: '#ff8833'
      },
      options.collectionStyle
    );
  }

  log(2, 'options:', options);

  // Create the layer group that we add all layers to
  const layerGroup = L.layerGroup();
  if (!layerGroup.options) layerGroup.options = {};
  layerGroup.options.debugLevel = options.debugLevel;
  layerGroup.orphan = true;
  registerEvents(layerGroup);

  if (
    data.isCollectionCollection() ||
    data.isItemCollection() ||
    data.isItem() ||
    data.isCollection()
  ) {
    if (data.toGeoJSON().features.length === 0) {
      log(1, 'No features found in the provided stac data');
      return null;
    }
    const layer = L.geoJSON(data.toGeoJSON(), {
      style: options.collectionStyle
    });
    addLayer(layer, layerGroup, data);
  }

  // use the extent of the vector layer
  layerGroup.getBounds = () => {
    const lyr = layerGroup.getLayers().find((lyr) => lyr.toGeoJSON);
    if (!lyr) {
      log(
        1,
        'unable to get bounds without a vector layer. This often happens when there was an issue determining the bounding box of the provided data.'
      );
      return;
    }
    const bounds = lyr.getBounds();
    const southWest = [bounds.getSouth(), bounds.getWest()];
    const northEast = [bounds.getNorth(), bounds.getEast()];
    return [southWest, northEast];
  };
  layerGroup.bringToFront = () =>
    layerGroup.getLayers().forEach((layer) => layer.bringToFront());
  layerGroup.bringToBack = () =>
    layerGroup.getLayers().forEach((layer) => layer.bringToBack());

  layerGroup.on('add', () => {
    layerGroup.orphan = false;
    flushEventQueue();
  });
  layerGroup.on('remove', () => (layerGroup.orphan = true));

  return layerGroup;
};

L.stacLayer = stacGeometryLayer;
