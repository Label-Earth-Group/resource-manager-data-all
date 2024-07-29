/* eslint-disable no-unused-vars */

import { Button, Box, Typography } from '@mui/material';
import { headerHeight, marginSmall, useSettings } from 'design';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LeafletMapComponent } from '../components/MapComponent.js';
import { MapComponent } from '../components/TestMap.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../../../utils/utils.js';
import { useLazySearchItemsQuery } from '../services/searchApi.ts';
import { productTree } from '../utils/constants.js';
import { CloudCoverSlider } from '../components/CloudCoverSlider.js';
import { SelectableTree } from '../components/SelectableTree.js';
import { ProductTags } from '../components/ProductTags.js';
import { formatSearch } from '../services/stacUtils.ts';
import {
  DateRangePicker,
  CustomDateRangePicker
} from '../components/DateTimeRangePicker.js';
import { Utils } from '../services/utils.js';

const StacSearch = () => {
  const PAGESIZE = 20;
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const mapRef = useRef();

  // ======================== initialize the states ====================================
  // 1.states for search query
  const [productIDs, setProductIDs] = useState([]);
  const [spatialExtent, setSpatialExtent] = useState(null);
  const [temporalExtent, setTemporalExtent] = useState([null, null]);
  const [cloudCover, setCloudCover] = useState([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);

  const products = useMemo(() => {
    return Utils.filterLeafObjects(productTree, productIDs);
  }, [productIDs]);

  const searchState = {
    products: products, //for any additional filters, but into this list under each product
    spatialExtent: spatialExtent,
    temporalExtent: temporalExtent,
    cloudCover: cloudCover,
    page: currentPage,
    pageSize: PAGESIZE
  };
  console.log('searchState', searchState);

  // 2. states for result display
  /**
   * configure the display state different from the rtk-query's state, by wiring them up through useEffect,
   * allowing to clear it as needed without affecting the original data fetched from the server.
   */
  const [searchResponse, setSearchResponse] = useState(null);

  // 3. states solely for UI control
  const [currentTab, setCurrentTab] = useState('Search');
  const [selectedProductTreeIDs, setSelectedProductTreeIDs] = useState([]);
  const [highlightedItems, setHighlightedItems] = useState([]);

  // ======================= wiring up the states =================================
  // 1. set up the rtk-query lazy query hook
  const [searchItems, { data, error: searchError, isLoading, isFetching }] =
    useLazySearchItemsQuery();
  useHandleError(searchError, dispatch);
  useEffect(() => {
    setSearchResponse(data);
  }, [data]); //wiring the display state with rtk-query state

  // 2. search triggers
  const handleSearchItems = () => {
    setCurrentPage(1); //every time the search triggers, set the page to start from 1
    searchItems(formatSearch(searchState), true);
  };

  const handleSetPage = (page) => {
    setCurrentPage(page);
    searchItems(formatSearch(searchState), true);
  };

  // 3. reset the search
  const handleReset = () => {
    setProductIDs([]);
    setSpatialExtent(null);
    setTemporalExtent([null, null]);
    setCloudCover([0, 100]);
    setCurrentPage(1);
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

  // last, deal with response result
  if (searchResponse) {
    const { features: items } = searchResponse;
    console.info(items);
  }

  return (
    <>
      <Helmet>
        <title>Search Remote Sensing Images</title>
      </Helmet>
      <div
        style={{
          position: 'static',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%'
        }}
      >
        {/* <LeafletMapComponent ref={mapRef}></LeafletMapComponent> */}
        <MapComponent
          spatialExtent={spatialExtent}
          onSpatialExtentChange={setSpatialExtent}
        ></MapComponent>
      </div>
      <Box
        sx={{
          position: 'absolute',
          left: '0px',
          mx: `${marginSmall}px`,
          my: `${marginSmall}px`,
          backgroundColor: 'white',
          padding: `${marginSmall}px`,
          boxShadow: 3,
          zIndex: 1000,
          width: '400px',
          height: `calc(100% - ${headerHeight + 2 * marginSmall}px)`
        }}
      >
        <Box sx={{ mb: 2 }}>
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
        <CloudCoverSlider
          value={searchState['cloudCover']}
          onChange={setCloudCover}
        />
        <Typography variant="body1">影像产品</Typography>
        <ProductTags products={products} setProductIDs={setProductIDs} />
        <SelectableTree
          items={productTree}
          selectedItemIDs={productIDs}
          setSelectedItemIDs={setProductIDs}
        ></SelectableTree>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: '0px',
          mx: `${marginSmall}px`,
          my: `${marginSmall}px`,
          backgroundColor: 'white',
          padding: `${marginSmall}px`,
          boxShadow: 3,
          zIndex: 1000,
          width: `calc(100% - ${3 * marginSmall + 400}px)`,
          height: '100px'
        }}
      >
        <DateRangePicker
          dateRange={temporalExtent}
          setDateRange={setTemporalExtent}
        />
      </Box>
    </>
  );
};

export default StacSearch;
