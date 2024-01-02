import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const imageApiUrl = process.env.REACT_APP_PGSTAC_API;

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({ baseUrl: imageApiUrl }),
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => 'collections'
    }),
    getCollectionById: builder.query({
      query: (collectionID) => `collections/${collectionID}`
    }),
    getCollectionItemsByCollectionID: builder.query({
      query: ({ collectionID, page = 1, numResultsPerPage = 20 }) =>
        `collections/${collectionID}/items?page=${page}&limit=${numResultsPerPage}`
    })
  })
});

export const { useGetCollectionsQuery, useGetCollectionByIdQuery } = imageApi;
