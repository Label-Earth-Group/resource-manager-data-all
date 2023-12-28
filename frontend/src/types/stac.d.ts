import type { Geometry } from 'geojson';
import type { GenericObject } from './common';

export type Bbox =
  | [number, number, number, number]
  | [number, number, number, number, number, number];
export type ItemIdList = string[];
export type CollectionIdList = string[];
export type DateRange = {
  from?: string;
  to?: string;
};
export type Sortby = {
  field: string;
  direction: 'asc' | 'desc';
};

export type SearchPayload = {
  bbox?: Bbox;
  geometry?: any[]; //for component state
  intersects?: Geometry; //for search payload
  dateRange?: DateRange; //for component state
  datetime?: string; //for search payload
  collections?: CollectionIdList;
  ids?: ItemIdList;
  [key: string]: any; //additional queryables
  limit?: number;
  page?: number;
  sortby?: Sortby[];
};

export type LinkBody = SearchPayload & {
  merge?: boolean;
};

export type SearchResponse = {
  type: 'FeatureCollection';
  features: Item[];
  links: Link[];
  numberMatched: number;
  numberReturned: number;
};

export type Link = {
  href: string;
  rel: string;
  type?: string;
  hreflang?: string;
  title?: string;
  length?: number;
  method?: string;
  headers?: GenericObject;
  body?: LinkBody;
  merge?: boolean;
};

export type ItemAsset = {
  href: string;
  title?: string;
  description?: string;
  type?: string;
  role?: string;
  roles?: string[];
  _dc_qs?: string;
};

export type EODAGItemAsset = {
  [key: string]: ItemAsset;
  downloadLink: ItemAsset;
  thumbnail: ItemAsset;
  preview: ItemAsset;
  origin_assets: EODAGItemAsset;
};

export type Item = {
  id: string;
  bbox: Bbox;
  geometry: Geometry;
  type: 'Feature';
  properties: GenericObject;
  links: Link[];
  assets: EODAGItemAsset;
};

type Role = 'licensor' | 'producer' | 'processor' | 'host';

export type Provider = {
  name: string;
  description?: string;
  roles?: Role[];
  url: string;
};

type SpatialExtent = {
  bbox: number[][];
};

type TemporalExtent = {
  interval: string | null[][];
};

export type Extent = {
  spatial: SpatialExtent;
  temporal: TemporalExtent;
};

export type Collection = {
  type: 'Collection';
  stac_version: string;
  stac_extensions?: string[];
  id: string;
  title?: string;
  keywords?: string[];
  license: string;
  providers: Provider[];
  extent: Extent;
  links: Link[];
  assets: GenericObject;
};

export type CollectionsResponse = {
  collections: Collection[];
  links: Link[];
};
