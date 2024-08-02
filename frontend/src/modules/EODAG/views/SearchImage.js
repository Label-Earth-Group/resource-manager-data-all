/* eslint-disable no-unused-vars */

import { Button, Box, Typography, Stack, Divider } from '@mui/material';
import { headerHeight, marginSmall } from 'design';
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@mui/styles';
import { Helmet } from 'react-helmet-async';
import { MapComponent } from '../components/TestMap.js';
import { StacGeometryLayer } from '../components/StacMapLayer.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../../../utils/utils.js';
import { useLazySearchItemsQuery } from '../services/searchApi.ts';
import { productTree } from '../utils/constants.js';
import { CloudCoverSlider } from '../components/CloudCoverSlider.js';
import { SelectableTree } from '../components/SelectableTree.js';
import { ProductTags } from '../components/ProductTags.js';
import { formatSearch } from '../services/stacUtils.ts';
import { DateRangePicker } from '../components/DateTimeRangePicker.js';
import { SpatialExtentSetting } from '../components/SpatialExtentSetting.js';
import { SERPListDisplay, SERPCardDisplay } from '../components/SERP.js';
import { Utils } from '../services/utils.js';

const StacSearch = () => {
  const PAGESIZE = 20;
  const dispatch = useDispatch();
  const theme = useTheme();

  // ======================== initialize the states ====================================
  // 1.states for search query
  const [productIDs, setProductIDs] = useState([]);
  const [spatialExtent, setSpatialExtent] = useState(null);
  const [temporalExtent, setTemporalExtent] = useState([null, null]);
  const [cloudCover, setCloudCover] = useState([0, 100]);

  const products = useMemo(() => {
    return Utils.filterLeafObjects(productTree, productIDs);
  }, [productIDs]);

  const searchState = {
    products: products, //for any additional filters, but into this list under each product
    spatialExtent: spatialExtent,
    temporalExtent: temporalExtent,
    cloudCover: cloudCover,
    pageSize: PAGESIZE
  };
  console.info('searchState', searchState);

  // 2. states for result display
  /**
   * configure the display state different from the rtk-query's state, by wiring them up through useEffect,
   * allowing to clear it as needed without affecting the original data fetched from the server.
   */
  const [searchResponse, setSearchResponse] = useState(null);

  // 3. states solely for UI control
  const [highlightedItems, setHighlightedItems] = useState([]);

  // ======================= wiring up the states =================================
  // 1. set up the rtk-query lazy query hook
  const [searchItems, { data, error: searchError, isLoading, isFetching }] =
    useLazySearchItemsQuery();
  useHandleError(searchError, dispatch);
  useEffect(() => {
    setSearchResponse(data);
  }, [data]);
  //wiring the display state with rtk-query state

  // 2. search triggers
  const handleSearchItems = () => {
    searchItems(formatSearch(searchState), true);
  };

  // 3. reset the search
  const handleReset = () => {
    setProductIDs([]);
    setSpatialExtent(null);
    setTemporalExtent([null, null]);
    setCloudCover([0, 100]);
    setSearchResponse(null);
    setHighlightedItems([]);
  };

  // 4. deal with different situations
  // // Pay attention to the order of handling different situations
  // // 1. first, deal with isLoading
  // if (isLoading) {
  //   return <CircularProgress />;
  // }

  // // 2. deal with error
  // if (searchError || !searchResponse) {
  //   return <>Error</>; //TODO: error display component
  // }

  return (
    <>
      <Helmet>
        <title>Search Remote Sensing Images</title>
      </Helmet>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        divider={<Divider orientation="vertical" flexItem variant="middle" />}
        spacing={2}
        sx={{
          padding: `${marginSmall}px`,
          width: '100%',
          height: '72px',
          backgroundColor: theme.palette.background
        }}
      >
        <DateRangePicker
          dateRange={temporalExtent}
          setDateRange={setTemporalExtent}
        />
        <SpatialExtentSetting
          setSpatialExtent={setSpatialExtent}
        ></SpatialExtentSetting>
        <Box sx={{ flex: 'auto', textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchItems}
            sx={{ mr: 2 }}
          >
            查询
          </Button>
          <Button variant="contained" color="secondary" onClick={handleReset}>
            重置
          </Button>
        </Box>
      </Stack>
      <div
        style={{
          position: 'static',
          top: '60px',
          left: '0px',
          width: '100%',
          height: `calc(100% - 72px)`
        }}
      >
        <MapComponent
          spatialExtent={spatialExtent}
          onSpatialExtentChange={setSpatialExtent}
        >
          {searchResponse && (
            <StacGeometryLayer
              stacData={searchResponse}
              highlightedItems={highlightedItems}
              setHighlightedItems={setHighlightedItems}
            ></StacGeometryLayer>
          )}
        </MapComponent>
      </div>
      <Box
        sx={{
          position: 'absolute',
          left: '0px',
          bottom: '0px',
          mx: `${marginSmall}px`,
          my: `${marginSmall}px`,
          backgroundColor: 'white',
          padding: `${marginSmall}px`,
          boxShadow: 3,
          zIndex: 1000,
          width: '400px',
          height: `calc(100% - ${headerHeight + 2 * marginSmall + 72}px)`
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <CloudCoverSlider value={cloudCover} onChange={setCloudCover} />
          <Typography variant="body1">影像产品</Typography>
          <ProductTags products={products} setProductIDs={setProductIDs} />
          <Box sx={{ flexBasis: 'auto', flexGrow: 1, overflowY: 'auto' }}>
            <SelectableTree
              items={productTree}
              selectedItemIDs={productIDs}
              setSelectedItemIDs={setProductIDs}
            ></SelectableTree>
          </Box>
        </Stack>
      </Box>
      {searchResponse && (
        <Box
          sx={{
            position: 'absolute',
            right: '0px',
            bottom: '0px',
            mx: `${marginSmall}px`,
            my: `${marginSmall}px`,
            backgroundColor: 'white',
            padding: `${marginSmall}px`,
            boxShadow: 3,
            zIndex: 1000,
            width: '400px',
            height: `calc(100% - ${headerHeight + 2 * marginSmall + 72}px)`,
            overflowY: 'auto'
          }}
        >
          <Box>
            <Typography>
              查询到<strong>{searchResponse?.context?.matched}</strong> 条结果
            </Typography>
          </Box>
          <SERPCardDisplay
            features={searchResponse?.features}
            entryPoint="eodag"
            showCollection={true}
            highlightedItems={highlightedItems}
            setHighlightedItems={setHighlightedItems}
          ></SERPCardDisplay>
        </Box>
      )}
    </>
  );
};

export default StacSearch;
