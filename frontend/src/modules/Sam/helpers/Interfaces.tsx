// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import { Tensor } from 'onnxruntime-web';
// import {tileLayer} from 'leaflet';
import L from 'leaflet';
import { SAMGeo } from './samgeo';

export interface modelScaleProps {
  samScale: number;
  height: number;
  width: number;
}

export interface modelInputProps {
  x: number;
  y: number;
  clickType: number;
}

export interface modeDataProps {
  clicks?: Array<modelInputProps>;
  tensor: Tensor;
  modelScale: modelScaleProps;
}

export interface ToolProps {
  handleMouseMove: (e: any) => void;
}

export interface SatelliteData {
  features: any;
  imageUrl: string;
}

export interface ISamState {
  samModel: SAMGeo;
  map: L.Map;
  mapClick: any;
  loading: boolean;
  polygonLayer: L.GeoJSON;
  boxLayer: L.GeoJSON;
  eventType: string;
  collapsed: boolean;
  satelliteData: SatelliteData[];
}
