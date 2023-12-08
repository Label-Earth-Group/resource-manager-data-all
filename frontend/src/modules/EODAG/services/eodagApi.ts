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

/**
 * Get summary as filters from EODAG collections,
 * directly from 'keyword' field, as each key has unique meaning.
 */
export const getSummaryFilters = (collections: Collection[], summaryIndex) => {
  var summaryArray = [];
  collections.forEach((c) => {
    let s = c.keywords[summaryIndex];
    if (s) {
      if (s.includes(',')) {
        s.split(',').forEach((subS) => {
          if (!summaryArray.includes(subS)) {
            summaryArray.push(subS);
          }
        });
      } else {
        if (!summaryArray.includes(s)) {
          summaryArray.push(s);
        }
      }
    }
  });
  return summaryArray.sort();
};
