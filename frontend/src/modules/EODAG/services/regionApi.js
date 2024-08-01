import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const regionApi_URL = 'https://fts.jd.com/area/get';
// const defaultHeaders = {
//   Accept: 'application/json, text/plain, */*',
//   'Accept-Encoding': 'gzip, deflate, br, zstd',
//   'Accept-Language':
//     'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5',
//   'Access-Agent': 'pc-dss',
//   Cookie:
//     'CTC_SCI=1033ECE51E4F5A6952DA5DD74ECBF06EB479CE152FB9AA8EB0A05BC216D9C0D0074B13D58F2A06230D4B727A2772E586BB0B0EDD708DE82E65ATZRQ2Xg==; CTC_CAL=39454D569F803C827CE928F98D3ED1FDB0E88CDFE99B6A59DE807BFE0F25262E3071C4541F005C6A8296933A2D280991E79B386FF310DD959F0TZRQ2Pw==; CTC_JMC=58E45E9A6BC3A026DEF07DD84614F7AC4DAD9FE0AFE14B6165E41ECD47FACAAA063TZRQ2dg==',
//   'Current-Route':
//     '%E5%85%89%E5%AD%A6%E4%B8%8ESAR%E5%8D%AB%E6%98%9F%E8%BD%BD%E8%8D%B7%E6%A3%80%E7%B4%A2',
//   Ipaddr: '159.226.112.18',
//   Murmur: '5ed78340ad124a0744a629643566b2c1',
//   Murmur2:
//     '97D125F7B2B1D59FBCD9359555A656A59871AF828018BB0E94BF1A50B4E18231E4C2479BC756F4298D44B8655C9F37BF',
//   Priority: 'u=1, i',
//   Referer: 'https://data.cresda.cn/',
//   'Sec-Ch-Ua':
//     '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
//   'Sec-Ch-Ua-Mobile': '?0',
//   'Sec-Ch-Ua-Platform': '"Windows"',
//   'Sec-Fetch-Dest': 'empty',
//   'Sec-Fetch-Mode': 'cors',
//   'Sec-Fetch-Site': 'same-origin',
//   'User-Agent':
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0'
// };

// Define a service using a base URL and expected endpoints
export const regionApi = createApi({
  reducerPath: 'regionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: regionApi_URL,
    prepareHeaders: (headers) => {
      headers.delete('Referer');
      headers.delete('Origin');
      headers.delete('sec-fetch-dest');
      headers.delete('sec-fetch-mode');
      headers.delete('sec-fetch-site');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getSubRegions: builder.query({
      query: (regionFid) => `?fid=${regionFid ? regionFid : -1}`
    }),
    getCountries: builder.query({
      query: () => `global/citycode`
    }),
    getProvinces: builder.query({
      query: (countryCode) => `provinces?code=${countryCode}`
    }),
    getCities: builder.query({
      query: (provinceCode) => `citys?provinceCode=${provinceCode}`
    }),
    getCounties: builder.query({
      query: (cityCode) => `countys?cityCode=${cityCode}`
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSubRegionsQuery,
  useGetCountriesQuery,
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetCountiesQuery
} = regionApi;
