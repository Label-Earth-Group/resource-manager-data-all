import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.github.com/' }),
  endpoints: (builder) => ({
    getRepoContents: builder.query({
      query: ({ repoFullName, path = '' }) =>
        `/repos/${repoFullName}/contents/${path}`
    })
  })
});

export const { useGetRepoContentsQuery } = githubApi;
