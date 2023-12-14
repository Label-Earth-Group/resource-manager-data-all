import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CollectionsResponse,
  Collection,
  Item,
  SearchResponse,
  ItemAsset
} from 'types/stac';

const eodagApi_URL = process.env.REACT_APP_EODAG_API;

export type EODAGAsset = ItemAsset | Map<'origin_assets', ItemAsset>;

export type EODAGItem = Omit<Item, 'assets'> & {
  assets: EODAGAsset[];
};

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
    getCollectionQueryablesByCollectionID: builder.query<string[], string>({
      query: (collectionID) => `collections/${collectionID}/queryables`
    }),
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
  useGetItemDownloadByCollectionIDAndItemIDQuery
} = eodagApi;

export const EODAG_SUMMARY_INDEX = {
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
  var summaryArray = [];
  collections.forEach((c) => {
    let s = c.keywords[summaryPos];
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
  return (collection) => {
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
  return (collection) => {
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
