import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CollectionsResponse,
  Collection,
  Item,
  SearchResponse,
  Bbox,
  DateRange,
  SearchPayload,
  EODAGItemAsset
} from 'types/stac';
import type { GenericObject } from 'types/common';

const eodagApi_URL = process.env.REACT_APP_EODAG_API;

// Define a service using a base URL and expected endpoints
export const eodagApi = createApi({
  reducerPath: 'eodagApi',
  baseQuery: fetchBaseQuery({ baseUrl: eodagApi_URL }),
  endpoints: (builder) => ({
    getCollectionsResponse: builder.query<CollectionsResponse, void>({
      query: () => `collections`
    }),
    getCollectionByCollectionID: builder.query<Collection, string>({
      query: (collectionID) => `collections/${collectionID}`
    }),
    getCollectionQueryablesByCollectionID: builder.query<GenericObject, string>(
      {
        query: (collectionID) => `collections/${collectionID}/queryables`
      }
    ),
    getCollectionItemsByCollectionID: builder.query<
      SearchResponse,
      {
        collectionID: string;
        page: number;
        numResultsPerPage: number;
      }
    >({
      query: ({ collectionID, page = 1, numResultsPerPage = 20 }) =>
        `collections/${collectionID}/items?page=${page}&limit=${numResultsPerPage}`
    }),
    getItemByCollectionIDAndItemID: builder.query<
      Item,
      { collectionID: string; itemID: string }
    >({
      query: ({ collectionID, itemID }) =>
        `collections/${collectionID}/items/${itemID}`
    }),
    getItemDownloadByCollectionIDAndItemID: builder.query<
      Item,
      { collectionID: string; itemID: string }
    >({
      query: ({ collectionID, itemID }) =>
        `collections/${collectionID}/items/${itemID}/download`
    }),
    searchItems: builder.query<SearchResponse, SearchPayload>({
      query: (searchFilters) => ({
        url: 'search',
        method: 'POST',
        body: searchFilters
      })
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCollectionsResponseQuery,
  useGetCollectionQueryablesByCollectionIDQuery,
  useGetCollectionItemsByCollectionIDQuery,
  useGetItemByCollectionIDAndItemIDQuery,
  useGetItemDownloadByCollectionIDAndItemIDQuery,
  useSearchItemsQuery,
  useLazySearchItemsQuery
} = eodagApi;

export const EODAG_SUMMARY_INDEX: GenericObject = {
  INSTRUMENT: 0,
  CONSTELLATION: 1,
  PLATFORM: 2,
  PROCESSING_LEVEL: 3,
  SENSOR_TYPE: 4
};

export type Filters = {
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

export function fixBboxCoordinateOrder(bbox?: Bbox): Bbox | undefined {
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

export function makeArrayPayload(arr?: any[]) {
  /* eslint-disable-line @typescript-eslint/no-explicit-any */
  return arr?.length ? arr : undefined;
}

export function makeDatetimePayload(dateRange?: DateRange): string | undefined {
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

export function formatPayload(searchFilters: SearchPayload): SearchPayload {
  const { ids, bbox, dateRange, collections, ...restPayload } = searchFilters;
  const requestPayload = {
    ...restPayload,
    ids: makeArrayPayload(ids),
    collections: makeArrayPayload(collections),
    bbox: fixBboxCoordinateOrder(bbox),
    datetime: makeDatetimePayload(dateRange)
  };
  // sort these search fields to facilitate better cache and remove undefined fields
  const requestPayloadSorted: SearchPayload = {};
  Object.keys(requestPayload)
    .sort()
    .forEach((key) => {
      const typedKey = key as keyof typeof requestPayload;
      requestPayload[typedKey] &&
        (requestPayloadSorted[typedKey] = requestPayload[typedKey]);
    });
  return requestPayloadSorted;
}
