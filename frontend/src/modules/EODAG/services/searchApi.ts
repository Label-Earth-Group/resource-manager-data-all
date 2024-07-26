import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CollectionsResponse,
  Collection,
  Item,
  SearchResponse,
  SearchPayload
} from 'types/stac';
import type { GenericObject } from 'types/common';
// import { STAC } from 'stac-js';

const searchApi_URL = process.env.REACT_APP_SEARCH_API;

// Define a service using a base URL and expected endpoints
export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: searchApi_URL }),
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
} = searchApi;
