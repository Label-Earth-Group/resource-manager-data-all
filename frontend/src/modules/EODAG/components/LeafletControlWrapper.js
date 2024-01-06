import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

export const LeafletControlWrapper = (props) => {
  const { children, position } = props;
  const map = useMap();

  useEffect(() => {
    const positionMap = {
      topright: 'leaflet-top leaflet-right',
      topleft: 'leaflet-top leaflet-left',
      bottomright: 'leaflet-bottom leaflet-right',
      bottomleft: 'leaflet-bottom leaflet-left'
    };
    const positionClass =
      (position && positionMap[position]) || positionMap['topright'];

    /** a custom control class for binding react component to leaflet map container */
    const CustomControlClass = L.Control.extend({
      onAdd: function (map) {
        const container = L.DomUtil.create(
          'div',
          positionClass + ' leaflet-control'
        );
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
    const createdControl = new CustomControlClass({ position });
    createdControl.addTo(map);
  }, [map, children, position]);

  return <></>;
};
