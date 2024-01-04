import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const titilerApiURL = process.env.REACT_APP_TITILER_API;

type AssetInfo = {
  bounds: [any, any, any, any];
  minzoom: number;
  maxzoom: number;
  band_metadata: Array<[string, { [key: string]: any }]>;
  band_descriptions: Array<[string, string]>;
  dtype: string;
  nodata_type: 'Alpha' | 'Mask' | 'Internal' | 'Nodata' | 'None';
  colorinterp?: Array<string> | null;
  scale?: number | null;
  offset?: number | null;
  colormap?: { [key: string]: [number, number, number, number] } | null;
};
type AssetsInfo = {
  [key: string]: AssetInfo;
};
type TileJSON = {
  tilejson: string; // Default: "2.2.0"
  name?: string | null;
  description?: string | null;
  version: string; // Default: "1.0.0"
  attribution?: string | null;
  template?: string | null;
  legend?: string | null;
  scheme: 'xyz' | 'tms'; // Default: "xyz"
  tiles: string[];
  grids?: string[] | null;
  data?: string[] | null;
  minzoom: number; // Range: [0, 30], Default: 0
  maxzoom: number; // Range: [0, 30], Default: 30
  bounds?: number[]; // Default: [-180, -90, 180, 90]
  center?: [number, number, number] | null;
};

// Define a service using a base URL and expected endpoints
export const titilerApi = createApi({
  reducerPath: 'titilerApi',
  baseQuery: fetchBaseQuery({ baseUrl: titilerApiURL }),
  endpoints: (builder) => ({
    getItemAssetsInfo: builder.query<
      AssetsInfo,
      { collectionID: string; itemID: string }
    >({
      query: ({ collectionID, itemID }) =>
        `/collections/${collectionID}/items/${itemID}/info`
    }),

    getItemAssetTileJson: builder.query<
      TileJSON,
      { collectionID: string; itemID: string; assets: string; params: any }
    >({
      query: ({ collectionID, itemID, assets, params }) => {
        console.log('params', params);
        params = params || {};
        params['tileMatrixSetId'] =
          params?.tileMatrixSetId || 'WebMercatorQuad'; //set default tile matrix
        params['assets'] = assets;
        console.log('params', params);
        const formattedParams = new URLSearchParams(params).toString();
        return {
          url: `/collections/${collectionID}/items/${itemID}/tilejson.json?${formattedParams}`
        };
      }
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetItemAssetsInfoQuery, useGetItemAssetTileJsonQuery } =
  titilerApi;
