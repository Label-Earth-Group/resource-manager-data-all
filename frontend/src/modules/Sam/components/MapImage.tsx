// @ts-ignore
// import npyjs from 'npyjs';
import React, { useEffect, useState } from 'react';
import L, { LatLngBounds } from 'leaflet';
import { Button, Backdrop, CircularProgress } from '@mui/material';
// import L from 'leaflet';
import 'leaflet.chinatmsproviders';
import { ISamState } from '../helpers/Interfaces';
import { SAMGeo } from '../helpers/samgeo.tsx';
import { EMBEDDING_URL } from '../helpers/contant.tsx';
import { useMap, ZoomControl } from 'react-leaflet';
import { LeafletControl } from '../../EODAG/components/LeafletControl.tsx';

const Model_URL = '/assets/sam_onnx_quantized_example.onnx';

const initState = {
  samModel: null,
  map: null,
  mapClick: null,
  loading: false,
  polygonLayer: null,
  eventType: 'click',
  collapsed: true,
  satelliteData: []
};

function loadImage(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
    img.crossOrigin = 'Anonymous'; // 如果需要的话设置跨域
    img.src = url;
  });
}

async function loadAllImages(minx, miny, maxx, maxy, zoom, ctx) {
  let promises = [];
  for (var x = minx; x <= maxx; x++) {
    for (var y = miny; y <= maxy; y++) {
      let tileUrl = `https://t0.tianditu.gov.cn/DataServer?T=img_w&X=${x}&Y=${y}&L=${zoom}&tk=331d1f3b55990949af7a50f8223c8e20`;
      promises.push(loadImage(tileUrl));
    }
  }

  try {
    let images = await Promise.all(promises);
    var x_draw = minx;
    var y_draw = miny;
    images.forEach((img, index) => {
      ctx.drawImage(
        img,
        (x_draw - minx) * 256,
        (y_draw - miny) * 256,
        256,
        256
      );
      if ((index + 1) % (maxy - miny + 1) === 0) {
        x_draw++;
        y_draw = miny;
      } else {
        y_draw++;
      }
    });
  } catch (error) {
    console.error('One or more images failed to load:', error);
  }
}

const MapImage = () => {
  const map = useMap();
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [zoom, setZoom] = useState<number>(0);
  const [samState, setSamState] = useState<ISamState>(initState);

  // 地图点击就保存点击的坐标
  const onMapClick = (e) => {
    const isArray = Array.isArray(e);
    const coords = !isArray ? [e.latlng.lng, e.latlng.lat] : e;
    setSamState((pre) => ({
      ...pre,
      mapClick: coords
    }));
  };

  // 初始化地图，添加一个底图、一个polygon图层，将map对象（scene）、polygon图层对象（boundsLayer）、底图对象（layerSource）保存到samInfo中，最后监听地图点击事件
  useEffect(() => {
    //leaflet与div进行绑定，并指明默认的地图中心和缩放比例
    map.setView([39.89945, 116.40969], 13);
    //构建一个切片图层对象，并添加到map容器中
    L.tileLayer
      .chinaProvider('TianDiTu.Satellite.Map', {
        key: '331d1f3b55990949af7a50f8223c8e20',
        maxZoom: 18,
        minZoom: 2
      })
      .addTo(map);
    const polygonLayer = L.geoJSON().addTo(map);

    setBounds(map.getBounds());
    setZoom(map.getZoom());

    setSamState((pre) => ({
      ...pre,
      map: map,
      polygonLayer: polygonLayer
    }));

    map.on('click', onMapClick);
    map.on('moveend', () => {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    });
  }, []);

  // 点击生成 embedding=》获取当前地图的范围生成图片=》将图片保存到samInfo.samModel中=》获取这个图片的embedding并保存到samInfo.samModel中
  const generateEmbedding = async () => {
    console.log('started');
    setSamState((pre) => ({ ...pre, loading: true }));
    setBounds(samState.map.getBounds());
    setZoom(samState.map.getZoom());

    if (bounds && zoom && samState.map) {
      var sw = samState.map.project(bounds.getSouthWest(), zoom);
      var ne = samState.map.project(bounds.getNorthEast(), zoom);
      const tileSize = 256;

      var tileBounds = L.bounds(
        sw.divideBy(tileSize).floor(),
        ne.divideBy(tileSize).floor()
      );

      const canvas = document.createElement('canvas');
      canvas.width = (tileBounds.max.x - tileBounds.min.x + 1) * 256;
      canvas.height = (tileBounds.max.y - tileBounds.min.y + 1) * 256;
      const ctx = canvas.getContext('2d');
      loadAllImages(
        tileBounds.min.x,
        tileBounds.min.y,
        tileBounds.max.x,
        tileBounds.max.y,
        zoom,
        ctx
      ).then(async () => {
        // 确保所有图片加载完成后再获取 canvas 的 URL
        const base64 = canvas.toDataURL('image/jpeg');
        const index = (base64 as string).indexOf(',');
        const strBaseImg = (base64 as string)?.substring(index + 1);
        const formData = new FormData();
        formData.append('image_path', strBaseImg);

        const res = await (
          await fetch(EMBEDDING_URL, {
            body: formData,
            method: 'post'
          })
        ).arrayBuffer();

        samState.samModel.setEmbedding(res);

        // should set the finished state here
        console.log('fetched response');
        setSamState((pre) => ({ ...pre, loading: false }));
      });

      // console.log(samInfo.samModel)
      const mapHelper = samState.samModel.mapHelper;
      const lowerLeft = mapHelper.tileToLngLat(
        tileBounds.min.x,
        tileBounds.max.y + 1,
        zoom
      );
      const upperRight = mapHelper.tileToLngLat(
        tileBounds.max.x + 1,
        tileBounds.min.y,
        zoom
      );

      const imageExtent: [number, number, number, number] = [
        lowerLeft[0], // minX
        lowerLeft[1], // minY
        upperRight[0], // maxX
        upperRight[1] // maxY
      ];

      // 设置模型的图片
      samState.samModel.setGeoImage(canvas!.toDataURL(), {
        extent: imageExtent,
        width: canvas!.width,
        height: canvas!.height
      });

      // setSamState((pre) => ({ ...pre, loading: false }));
    } else return;
  };

  // 地图点击=》获取坐标保存到points中=》调用模型预测=》模型输出转化为多边形，裁剪对应图片=》保存到samInfo的satelliteData中
  useEffect(() => {
    if (!samState.mapClick || !samState.samModel) return;
    const points: Array<any> = [];
    try {
      const coord = samState.mapClick;
      if (samState.eventType === 'click') {
        const px = samState.samModel.lngLat2ImagePixel(coord);
        points.push({
          x: px[0],
          y: px[1],
          clickType: 1
        });
        console.info(points);
      } else if (samState.eventType === 'selectend') {
        const topLeft = samState.samModel.lngLat2ImagePixel([
          coord[0],
          coord[3]
        ]);
        const bottomRight = samState.samModel.lngLat2ImagePixel([
          coord[2],
          coord[1]
        ]);
        points.push({
          x: topLeft[0],
          y: topLeft[1],
          clickType: 2
        });
        points.push({
          x: bottomRight[0],
          y: bottomRight[1],
          clickType: 3
        });
      } else if (samState.eventType === 'all') {
        console.info(
          samState.samModel.image.width,
          samState.samModel.image.height
        );
      }

      if (points.length === 0) return;
      samState.samModel.predict(points).then(async (res) => {
        const polygon = await samState.samModel.exportGeoPolygon(res, 1);
        const image = samState.samModel.exportImageClip(res);

        const newData = {
          features: polygon.features,
          imageUrl: image.src
        };
        setSamState((pre) => {
          const hasData = pre.satelliteData.find(
            (item) => item.imageUrl === newData.imageUrl
          );
          if (hasData) {
            return { ...pre };
          }
          return {
            ...pre,
            satelliteData: [...pre.satelliteData, newData]
          };
        });
      });
    } catch (error) {
      console.warn('请先点击[生成 embedding] 按钮');
    }
  }, [samState.mapClick]);

  // 加载onnx模型，保存到samInfo中
  useEffect(() => {
    const sam = new SAMGeo({
      modelUrl: Model_URL
      // wasmPaths: WasmPaths,
    });
    sam.initModel().then(() => {
      setSamState((pre) => ({
        ...pre,
        samModel: sam
      }));
    });
  }, []);

  // 将satelliteData中的多边形数据更新到地图的polygon图层上（borderLayer）上
  useEffect(() => {
    if (samState.polygonLayer) {
      const newFeature = samState.satelliteData.map((item) => item.features);
      const newPolygon: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: newFeature.flat()
      };
      samState.polygonLayer.addData(newPolygon);
    }
  }, [samState.polygonLayer, samState.satelliteData]);
  console.log('loading', samState.loading);

  return (
    <>
      <LeafletControl position={'topleft'}>
        <Button variant="contained" color="primary" onClick={generateEmbedding}>
          Generate embedding
        </Button>
      </LeafletControl>
      <ZoomControl position="topright" />
      <Backdrop sx={{ color: '#fff', zIndex: 3000 }} open={samState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};
export default MapImage;
