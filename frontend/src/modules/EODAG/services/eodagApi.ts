import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CollectionsResponse, Collection } from 'types/stac';

const eodagApi_URL = process.env.REACT_APP_EODAG_API;

// Define a service using a base URL and expected endpoints
export const eodagApi = createApi({
  reducerPath: 'eodagApi',
  baseQuery: fetchBaseQuery({ baseUrl: eodagApi_URL }),
  endpoints: (builder) => ({
    getCollectionsResponse: builder.query<CollectionsResponse, void>({
      query: () => `collections`
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCollectionsResponseQuery } = eodagApi;

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
export const filterCollectionsBySummary = (
  collections: Collection[],
  filters: Filters
) => {
  return collections.filter((collection) => {
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
  });
};

/**
 * filter collection by name
 */
export const filterCollectionsByName = (
  collections: Collection[],
  name: String
) => {
  if (name && name !== '') {
    const filtered = collections.filter((collection) => {
      return collection.id.toLowerCase().includes(name.toLowerCase());
    });
    return filtered;
  } else {
    return collections;
  }
};
