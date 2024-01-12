import { onLayerGroupClick } from './events.js';

export function addLayer(layer, layerGroup, data) {
  layer.stac = data;
  layer.on('click', (evt) => onLayerGroupClick(evt, layerGroup));
  layerGroup.addLayer(layer);
}
