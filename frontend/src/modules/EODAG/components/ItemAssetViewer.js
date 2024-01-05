import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';

import L from 'leaflet';
import { MapContainer, useMap } from 'react-leaflet';
import { TianDiTuTileLayer } from './TianDiTuTileLayer';
import { StacGeometryLayer, ItemTitilerLayer } from './StacMapLayer.js';

import { useGetItemAssetsInfoQuery } from 'modules/PGSTAC/services/titilerApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';

export const LeafletControlWrapper = (props) => {
  const { children, position } = props;
  const positionMap = {
    topright: 'leaflet-top leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    bottomleft: 'leaflet-bottom leaflet-left'
  };
  const positionClass = positionMap[position] || positionMap['topright'];
  /** a custom control class for binding react component to leaflet map container */
  const CustomControlClass = L.Control.extend({
    onAdd: function (map) {
      const container = L.DomUtil.create('div', positionClass);
      // Transform container into a React component, and render children inside
      const root = createRoot(container);
      root.render(children);
      this.rootObject = root;
      return container;
    },
    onRemove: function (map) {
      this.rootObject.unmount();
    }
  });

  // add the class instance to map
  const map = useMap();
  useEffect(() => {
    function createControl(opts) {
      return new CustomControlClass(opts);
    }
    createControl({ position }).addTo(map);
  }, [CustomControlClass, map, position]);

  return <></>;
};

export function PGStacItemAssetViewer(props) {
  const { collectionID, itemID, item } = props;
  const dispatch = useDispatch();
  const { assets } = item;
  const assetName = assets.hasOwnProperty('visual') ? 'visual' : '';
  const options = {
    boundsStyle: {
      color: 'red',
      fillOpacity: 0
    }
  };

  const { data: assetsInfo, error } = useGetItemAssetsInfoQuery({
    collectionID,
    itemID
  });
  useHandleError(error, dispatch);
  console.info('assetsInfo', assetsInfo);

  return (
    <MapContainer scrollWheelZoom={true} id="map">
      <LeafletControlWrapper position="bottomleft">
        <button>Click Me</button>
      </LeafletControlWrapper>
      <TianDiTuTileLayer />
      {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
      <StacGeometryLayer stacData={item} options={options}></StacGeometryLayer>
      {assets.visual && (
        <ItemTitilerLayer
          collectionID={collectionID}
          itemID={itemID}
          assets={assetName}
        />
      )}
    </MapContainer>
  );
}

export function EODAGItemAssetViewer(props) {
  const { item } = props;
  const options = {
    boundsStyle: {
      color: 'red',
      fillOpacity: 0.3
    }
  };
  return (
    <MapContainer scrollWheelZoom={true} id="map">
      <TianDiTuTileLayer />
      {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
      <StacGeometryLayer stacData={item} options={options}></StacGeometryLayer>
    </MapContainer>
  );
}
