import type {
  Bbox,
  Collection,
  DateRange,
  EODAGItemAsset,
  Item,
  SearchPayload
} from 'types/stac';
import type { Geometry } from 'geojson';
import type { GenericObject } from 'types/common';

export const EODAG_SUMMARY_INDEX: GenericObject = {
  INSTRUMENT: 0,
  CONSTELLATION: 1,
  PLATFORM: 2,
  PROCESSING_LEVEL: 3,
  SENSOR_TYPE: 4
};

type Filters = {
  [k: string]: string[];
};

/**
 * Get summary as filters from EODAG collections,
 * directly from 'keyword' field, as each key has unique meaning.
 */
export const getSummaryFilters = (
  collections: Collection[],
  summaryPos: number
) => {
  var summaryArray: string[] = [];
  collections.forEach((c) => {
    let s = c.keywords && c.keywords[summaryPos];
    if (s) {
      String(s)
        .split(',')
        .forEach((subS) => {
          if (!summaryArray.includes(subS)) {
            summaryArray.push(subS);
          }
        });
    }
  });
  return summaryArray.sort();
};

/**
 * filter collection by summaries
 */
export const summaryFilterFunc = (filters: Filters) => {
  return (collection: Collection) => {
    let v = Object.entries(filters).map(([filterName, filterValues]) => {
      if (filterValues.join('').length === 0) {
        return true;
      } else {
        let s =
          collection.keywords &&
          collection.keywords[EODAG_SUMMARY_INDEX[filterName]];
        if (s) {
          let a = new Set(String(s).split(','));
          return filterValues.some((item) => a.has(item));
        } else {
          return false;
        }
      }
    });
    return v.every((value) => value === true);
  };
};

/**
 * filter collection by name
 */
export const nameFilterFunc = (name: String) => {
  return (collection: Collection) => {
    if (name && name !== '') {
      var result = true;
      for (const chunk of name.toLowerCase().split(' ')) {
        result = result && collection.id.toLowerCase().includes(chunk);
      }
      return result;
    } else {
      return true;
    }
  };
};

/**
 * get thumbnail href from item object
 * @param item the item object
 * @returns the href for thumbnail
 */
export const getThumbnailHrefFromItem = (item: Item) => {
  for (let k of Object.keys(item.assets)) {
    let asset = item.assets[k];
    if (k === 'thumbnail' || k === 'preview') {
      if (asset.href) return asset.href;
    }
  }
  if (item.assets.origin_assets) {
    let asset = item.assets.origin_assets as EODAGItemAsset;
    for (var k_original of Object.keys(asset)) {
      var o_asset = asset[k_original];
      if (k_original === 'thumbnail' || k_original === 'preview') {
        if (o_asset.href) return o_asset.href;
      }
    }
  }

  return null;
};

function fixBboxCoordinateOrder(bbox?: Bbox): Bbox | undefined {
  if (!bbox) {
    return undefined;
  }

  const [lonMin, latMin, lonMax, latMax] = bbox;
  const sortedBbox: Bbox = [lonMin, latMin, lonMax, latMax];

  if (lonMin > lonMax) {
    sortedBbox[0] = lonMax;
    sortedBbox[2] = lonMin;
  }

  if (latMin > latMax) {
    sortedBbox[1] = latMax;
    sortedBbox[3] = latMin;
  }

  return sortedBbox;
}

function makeArrayPayload(arr?: any[]) {
  /* eslint-disable-line @typescript-eslint/no-explicit-any */
  return arr?.length ? arr : undefined;
}

function makeDatetimePayload(dateRange?: DateRange): string | undefined {
  if (!dateRange) {
    return undefined;
  }
  const { from, to } = dateRange;
  if (from || to) {
    return `${from || '..'}/${to || '..'}`;
  } else {
    return undefined;
  }
}

/**
 * Get Geometry from leaflet layer object as Polygon or MultiPolygon
 */
function makeGeometryPayload(target: any): Geometry | undefined {
  // I didn’t found a method from leaflet that returns a Multipolygon so we build it if there are more than one polygon
  if (!target) {
    return undefined;
  }
  const layers: any[] = [];
  let geometry;
  target.map((l: any) => layers.push(l.toGeoJSON?.()));
  const geo = layers
    .filter((e) => e?.type === 'Feature')
    .map((e) => e.geometry)
    .filter((e) => e.type === 'Polygon');
  if (geo.length > 1) {
    geometry = {
      type: 'MultiPolygon',
      coordinates: geo.map((e) => e.coordinates)
    };
  } else {
    geometry = geo?.[0];
  }
  return geometry;
}

export function formatPayload(searchFilters: SearchPayload): SearchPayload {
  const {
    ids,
    bbox,
    startDate,
    endDate,
    collections,
    geometry,
    ...restPayload
  } = searchFilters;
  const dateRange =
    !startDate && !endDate
      ? undefined
      : {
          from: startDate ? startDate.toISOString() : undefined,
          to: endDate ? endDate.toISOString() : undefined
        };
  const requestPayload: Partial<SearchPayload> = {
    ...restPayload,
    ids: makeArrayPayload(ids),
    collections: makeArrayPayload(collections),
    bbox: fixBboxCoordinateOrder(bbox),
    intersects: makeGeometryPayload(geometry),
    datetime: makeDatetimePayload(dateRange)
  };
  // sort these search fields to facilitate better cache and remove undefined fields
  const requestPayloadSorted: Partial<SearchPayload> = {};
  Object.keys(requestPayload)
    .filter(
      (key) => requestPayload[key as keyof typeof requestPayload] !== undefined
    )
    .sort()
    .forEach((key) => {
      requestPayloadSorted[key as keyof typeof requestPayload] =
        requestPayload[key as keyof typeof requestPayload];
    });
  return requestPayloadSorted;
}
