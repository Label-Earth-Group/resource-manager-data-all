import { Button, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { headerHeight, tabHeight, marginSmall, useSettings } from 'design';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LeafletMapComponent } from '../components/MapComponent.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../../../utils/utils.js';
import { useLazySearchItemsQuery } from '../services/eodagApi.ts';

const productTypeTree = [
  {
    id: '1',
    label: 'LandSat-4 / 5 / TM',
    children: [
      { id: '1-1', label: 'Level-1 product' },
      { id: '1-2', label: 'Level-2 Surface Reflectance product' },
      { id: '1-3', label: 'Level-2 Surface Temperature product' },
      { id: '1-4', label: 'U.S. ARD Surface Reflectance product' },
      { id: '1-5', label: 'U.S. ARD Surface Temperature product' },
      { id: '1-6', label: 'Level-3 ...' }
    ]
  },
  {
    id: '2',
    label: 'LandSat-7 / ETM+',
    children: [
      { id: '2-1', label: 'Level-1 product' },
      { id: '2-2', label: 'Level-2 Surface Reflectance product' },
      { id: '2-3', label: 'Level-2 Surface Temperature product' },
      { id: '2-4', label: 'U.S. ARD Surface Reflectance product' },
      { id: '2-5', label: 'U.S. ARD Surface Temperature product' },
      { id: '2-6', label: 'Level-3 ...' }
    ]
  },
  {
    id: '3',
    label: 'LandSat-8/9 / OLI, TIRS',
    children: [
      { id: '3-1', label: 'Level-1 product' },
      { id: '3-2', label: 'Level-2 Surface Reflectance product' },
      { id: '3-3', label: 'Level-2 Surface Temperature product' },
      { id: '3-4', label: 'U.S. ARD Surface Reflectance product' },
      { id: '3-5', label: 'U.S. ARD Surface Temperature product' },
      { id: '3-6', label: 'Level-3 ...' }
    ]
  },
  {
    id: '4',
    label: 'Sentinel-1 / C-SAR',
    children: [
      { id: '4-1', label: 'Level-0 RAW product' },
      { id: '4-2', label: 'Level-1 GRD product' },
      { id: '4-3', label: 'Level-1 SLC product' },
      { id: '4-4', label: 'Level-2 OCN product' }
    ]
  },
  {
    id: '5',
    label: 'Sentinel-2 / MSI',
    children: [
      { id: '5-1', label: 'Level-1C product' },
      { id: '5-2', label: 'Level-2A product' }
    ]
  }
];


const StacSearch = () => {
  const PAGESIZE = 20;
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const mapRef = useRef();

  // get the default params from react-route state
  const location = useLocation();
  const defaultCollections =
    location.state.collections || [];

  // initialize the states
  // 1.the tab state
  const [currentTab, setCurrentTab] = useState('Search');
  // 2.the search query states
  const [selectedCollections, setSelectedCollections] = useState(defaultCollections);
  const [drawnItems, setDrawnItems] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightedItems, setHighlightedItems] = useState([]);

  const searchPayload = {
    page: currentPage,
    limit: PAGESIZE,
    collections: selectedCollections.map((c) => c.id),
    geometry: drawnItems,
    startDate: startDate,
    endDate: endDate
  };
  console.log('searchPayload', searchPayload);

  /**
   * the result display state
   * configure the display state different from the rtk-query's state, by wiring them up through useEffect,
   * allowing to clear it as needed without affecting the original data fetched from the server.
   */
  const [searchResponse, setSearchResponse] = useState(null);

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
        <LeafletMapComponent
          ref={mapRef}
          drawnItems={drawnItems}
          setDrawnItems={setDrawnItems}
          stacDataForDisplay={searchResponse}
          highlightedItems={highlightedItems}
          setHighlightedItems={setHighlightedItems}
        ></LeafletMapComponent>
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
          height: `calc(100% - ${headerHeight + 2 * marginSmall}px)`,
          overflowY: 'auto'
        }}
      >
        <RichTreeView multiSelect checkboxSelection items={productTypeTree} />
      </Box>
    </>
  );
};

export default StacSearch;
