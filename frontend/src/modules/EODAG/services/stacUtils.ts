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
import { Utils, stacPagination } from './utils';
import URI from 'urijs';

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

// =======================================================================
function formatDatetimeQuery(value: any[]): string | undefined {
  if (!value) {
    return undefined;
  }
  return value
    .map((dt) => {
      if (dt instanceof Date) {
        return dt.toISOString();
      } else if (dt) {
        return dt;
      } else {
        return '..';
      }
    })
    .join('/');
}

function formatSortbyForPOST(value: string) {
  // POST search requires sortby to be an array of objects containing a property name and sort direction.
  // See spec here: https://api.stacspec.org/v1.0.0-rc.1/item-search/#tag/Item-Search/operation/postItemSearch
  // This function converts the property name to the desired format.
  const sortby = {
    field: '',
    direction: 'asc'
  };

  // Check if the value starts with a minus sign ("-")
  if (value.startsWith('-')) {
    // sort by descending order
    sortby.field = value.substring(1);
    sortby.direction = 'desc';
  } else {
    //sort by ascending order
    sortby.field = value;
  }

  // Put the object in an array
  return [sortby];
}

export function getPaginationLinks(data: { links: any }) {
  let pages = {};
  if (Utils.isObject(data)) {
    let pageLinks = Utils.getLinksWithRels(data.links, stacPagination);
    for (let pageLink of pageLinks) {
      let rel = pageLink.rel === 'previous' ? 'prev' : pageLink.rel;
      pages[rel] = pageLink;
    }
  }
  return pages;
}

export function addFiltersToLink(
  link: { method: string; body: any; href: any },
  filters: { [x: string]: any; limit?: any },
  itemsPerPage = null
) {
  let isEmpty = (value) => {
    return (
      value === null ||
      (typeof value === 'number' && !Number.isFinite(value)) ||
      (typeof value === 'string' && value.length === 0) ||
      (typeof value === 'object' && Utils.size(value) === 0)
    );
  };

  if (!Utils.isObject(filters)) {
    filters = {};
  } else {
    filters = Object.assign({}, filters);
  }

  if (typeof filters.limit !== 'number' && typeof itemsPerPage === 'number') {
    filters.limit = itemsPerPage;
  }

  if (Utils.hasText(link.method) && link.method.toUpperCase() === 'POST') {
    let body = Object.assign({}, link.body);

    for (let key in filters) {
      let value = filters[key];
      if (isEmpty(value)) {
        delete body[key];
        continue;
      }

      if (key === 'sortby') {
        value = formatSortbyForPOST(value);
      } else if (key === 'datetime') {
        value = formatDatetimeQuery(value);
      } else if (key === 'filters') {
        Object.assign(body, value.toJSON());
        continue;
      }

      body[key] = value;
    }
    return Object.assign({}, link, { body });
  } else {
    // GET
    // Construct new link with search params
    let url = URI(link.href);

    for (let key in filters) {
      let value = filters[key];
      if (isEmpty(value)) {
        url.removeQuery(key);
        continue;
      }

      if (key === 'datetime') {
        value = formatDatetimeQuery(value);
      } else if (key === 'bbox') {
        value = value.join(',');
      } else if (key === 'collections' || key === 'ids' || key === 'q') {
        value = value.join(',');
      } else if (key === 'filters') {
        let params = value.toText();
        url.setQuery(params);
        continue;
      }

      url.setQuery(key, value);
    }

    return Object.assign({}, link, { href: url.toString() });
  }
}

export function supportsExtension(data, pattern) {
  if (!Utils.isObject(data) || !Array.isArray(data['stac_extensions'])) {
    return false;
  }
  let regexp = new RegExp('^' + pattern.replaceAll('*', '[^/]+') + '$');
  return Boolean(data['stac_extensions'].find((uri) => regexp.test(uri)));
}

export function formatSearchTerms(
  searchterm: string,
  target: string | any[] | { [s: string]: unknown } | ArrayLike<unknown>,
  and = true
) {
  if (typeof searchterm !== 'string' || searchterm.length === 0) {
    return false;
  }
  if (Utils.isObject(target)) {
    target = Object.values(target);
  } else if (typeof target === 'string') {
    target = [target];
  }

  if (!Array.isArray(target)) {
    return false;
  }

  let splitChars = /[\s.,;!&({[)}]]+/g;

  // Prepare search terms
  const searchtermList: string[] = searchterm.toLowerCase().split(splitChars);

  // Prepare text to search in
  const targetString = target
    .filter((s) => typeof s === 'string') // Remove non-strings
    .join(' ') // Merge into a single string
    .replace(splitChars, ' ') // replace split chars with white spaces
    .toLowerCase(); // Lowercase

  // Search with "and" or "or"
  let fn = and ? 'every' : 'some';
  return searchtermList[fn]((term: string) => targetString.includes(term));
}

export function formatSearch(searchState: SearchPayload): SearchPayload {
  const {
    products,
    spatialExtent,
    temporalExtent,
    cloudCover,
    // page,
    pageSize
    // ...restSearchState
  } = searchState;

  // the formated payload for post into search api
  const searchPayload = {
    limit: pageSize,
    // page: page,
    'filter-lang': 'cql-json'
  };

  if (spatialExtent) {
    searchPayload['intersects'] = spatialExtent;
  }
  if (temporalExtent) {
    searchPayload['datetime'] = formatDatetimeQuery(temporalExtent);
  }

  const filters = [];

  if (products && products.length > 0) {
    filters.push({
      op: 'or',
      args: products.map((product) => {
        return product['filter'];
      })
    });
  }

  if (cloudCover) {
    filters.push({
      op: 'between',
      args: [{ property: 'eo:cloud_cover' }, cloudCover[0], cloudCover[1]]
    });
  }

  if (filters.length > 1) {
    searchPayload['filter'] = { op: 'and', args: filters };
  } else if (filters.length === 1) {
    searchPayload['filter'] = filters[0];
  }

  return searchPayload;
}
