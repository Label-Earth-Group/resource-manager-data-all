import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.chinatmsproviders';

const MapImage = () => {
  var map: any = null;
  const mapRef = useRef(null);
  // const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  // const [zoom, setZoom] = useState<LatLngBounds | null>(null);

  // 初始化地图
  useEffect(() => {
    //leaflet与div进行绑定，并指明默认的地图中心和缩放比例
    map = L.map(mapRef.current, { attributionControl: false }).setView(
      [39.89945, 116.40969],
      13
    );
    //构建一个切片图层对象，并添加到map容器中
    L.tileLayer
      .chinaProvider('TianDiTu.Satellite.Map', {
        key: '331d1f3b55990949af7a50f8223c8e20',
        maxZoom: 18,
        minZoom: 2
      })
      .addTo(map);

    // map.on('moveend', () => {
    //     setBounds(map.getBounds());
    //     setZoom(map.getZoom());
    // });
  }, []);

  // const flyTo = (lat: number, lng: number, zoom: number) => {
  //   map.flyTo([lat, lng], zoom);
  // };

  // const handleDrawTiles = () => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   if (bounds && zoom) {
  //     // 计算瓦片在Canvas上的位置和大小
  //     const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  //     const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
  //     const tileSize = 256 * (1 << zoom);

  //     // 清空Canvas
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     // 绘制瓦片
  //     for (let x = Math.floor(topLeft.x / tileSize); x <= Math.ceil(bottomRight.x / tileSize); x++) {
  //       for (let y = Math.floor(topLeft.y / tileSize); y <= Math.ceil(bottomRight.y / tileSize); y++) {
  //         const url = `https://t{s}.tianditu.gov.cn/${'TianDiTu.Satellite.Map'}/wmts?service=wmts&request=GetTile&version=1.0.0&layer=${'TianDiTu.Satellite.Map'}&style=default&format=tiles&tileMatrixSet=w&width=256&height=256&tileMatrix=${zoom}&tileRow=${y}&tileCol=${x}&tk=${'331d1f3b55990949af7a50f8223c8e20'}`;
  //         const img = new Image();
  //         img.src = url;
  //         img.onload = () => {
  //           ctx.drawImage(img, x * tileSize - topLeft.x, y * tileSize - topLeft.y);
  //         };
  //       }
  //     }
  //   }
  // };

  return (
    <>
      <button>生成embedding</button>
      <div ref={mapRef} style={{ height: '450px' }} />
    </>
  );
};
export default MapImage;
