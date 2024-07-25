/* eslint-disable no-unused-vars */

import { Button, Box, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { headerHeight, marginSmall, useSettings } from 'design';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LeafletMapComponent } from '../components/MapComponent.js';
import { MapComponent } from '../components/TestMap.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../../../utils/utils.js';
import { useLazySearchItemsQuery } from '../services/eodagApi.ts';
import { productTree } from '../utils/constants.js';
import { CloudCoverSlider } from '../components/CloudCoverSlider.js';
import { SelectableTree } from '../components/SelectableTree.js';
import { ProductTags } from '../components/ProductTags.js';

const StacSearch = () => {
  const PAGESIZE = 20;
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const mapRef = useRef();

  // ======================== initialize the states ====================================
  // 1.the search states
  const [products, setProducts] = useState([]);
  const [spatialExtent, setSpatialExtent] = useState(null);
  const [temporalExtent, setTemporalExtent] = useState(null);
  const [cloudCover, setCloudCover] = useState([0, 20]);
  const [page, setPage] = useState(1);

  const searchState = {
    products: products, //for any additional filters, but into this list under each product
    spatialExtent: spatialExtent,
    temporalExtent: temporalExtent,
    cloudCover: cloudCover,
    page: page,
    pageSize: PAGESIZE
  };

  console.log('searchState', searchState);

  // 2. the result display states
  /**
   * configure the display state different from the rtk-query's state, by wiring them up through useEffect,
   * allowing to clear it as needed without affecting the original data fetched from the server.
   */
  const [searchResponse, setSearchResponse] = useState(null);

  // 3.the UI-control state
  const [currentTab, setCurrentTab] = useState('Search');
  const [selectedProductTreeIDs, setSelectedProductTreeIDs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedItems, setHighlightedItems] = useState([]);

  // ======================= wiring up the states =================================
  // set up the rtk-query lazy query hook
  const [searchItems, { data, error: searchError, isLoading, isFetching }] =
    useLazySearchItemsQuery();
  useHandleError(searchError, dispatch);
  useEffect(() => {
    setSearchResponse(data);
  }, [data]); //wiring the display state with rtk-query state

  // 2. last, deal with response result
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
          spatialExtent={searchState['spatialExtent']}
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
        <CloudCoverSlider
          value={searchState['cloudCover']}
          onChange={setCloudCover}
        />
        <Typography variant="body1">影像产品</Typography>
        <ProductTags products={products} setProducts={setProducts} />
        <SelectableTree
          items={productTree}
          selectedItemIDs={products}
          setSelectedItemIDs={setProducts}
        ></SelectableTree>
      </Box>
    </>
  );
};

export default StacSearch;
