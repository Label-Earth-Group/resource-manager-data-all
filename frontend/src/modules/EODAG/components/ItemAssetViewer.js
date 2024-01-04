import L from 'leaflet';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';
import { MapContainer, useMap } from 'react-leaflet';
import { TianDiTuTileLayer } from './TianDiTuTileLayer';
import { StacGeometryLayer, ItemTitilerLayer } from './StacMapLayer.js';
import { useEffect } from 'react';

const ViewOptionControl = (props) => {
  const ControlComponent = <button>Click Me</button>;
  /** a custom control class for binding react component to leaflet map container */
  const CustomControlClass = L.Control.extend({
    onAdd: function (map) {
      const container = L.DomUtil.create('div', 'leaflet-top leaflet-right');
      const root = createRoot(container); // createRoot(container!) if you use TypeScript
      root.render(ControlComponent);
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
    createControl({ position: 'topright' }).addTo(map);
  }, [CustomControlClass, map]);

  return <></>;
};

export function PGStacItemAssetViewer(props) {
  const { collectionID, itemID, item } = props;
  const { assets } = item;
  const assetName = assets.hasOwnProperty('visual') ? 'visual' : '';
  const options = {
    boundsStyle: {
      color: 'red',
      fillOpacity: 0
    }
  };

  return (
    <MapContainer scrollWheelZoom={true} id="map">
      <ViewOptionControl />
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
