import {
  Button,
  Card,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  Box,
  Container,
  Typography
} from '@mui/material';
import {
  Search,
  Dataset,
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { headerHeight, tabHeight, marginSmall, useSettings } from 'design';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SearchQuery } from '../components/SearchQuery';
import { LeafletMapComponent } from '../components/MapComponent';
import { StacItemDisplayList } from '../components/StacCommonComponent.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../../../utils/utils.js';
import { useLazySearchItemsQuery } from '../services/eodagApi.ts';
import { formatPayload } from '../services/stacUtils.ts';
import type {
  Collection,
  SearchPayload,
  SearchResponse
} from '../../../types/stac';

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

// function StacSearchPageHeader() {
//   return (
//     <Grid
//       alignItems="center"
//       container
//       justifyContent="space-between"
//       spacing={3}
//     >
//       <Grid item>
//         <Typography color="textPrimary" variant="h5">
//           Earth Open Data API Gateway -- Search
//         </Typography>
//         <Breadcrumbs
//           aria-label="breadcrumb"
//           separator={<ChevronRightIcon fontSize="small" />}
//           sx={{ mt: 1 }}
//         >
//           <Link underline="hover" color="textPrimary" variant="subtitle2">
//             Images
//           </Link>
//           <Link
//             underline="hover"
//             color="textPrimary"
//             component={RouterLink}
//             to="/console/eodag"
//             variant="subtitle2"
//           >
//             EODAG
//           </Link>
//           <Link underline="hover" color="textPrimary">
//             Search
//           </Link>
//         </Breadcrumbs>
//       </Grid>
//     </Grid>
//   );
// }

const StacSearch = () => {
  const PAGESIZE = 20;
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const mapRef = useRef();

  // get the default params from react-route state
  interface LocationState {
    collections?: Collection[]; // Replace 'any' with the specific type of 'collections' if known
  }
  const location = useLocation();
  const defaultCollections =
    (location.state as LocationState)?.collections || [];

  // initialize the states
  // 1.the tab state
  const [currentTab, setCurrentTab] = useState('Search');
  // 2.the search query states
  const [selectedCollections, setSelectedCollections] = useState<
    Collection[] | null
  >(defaultCollections);
  const [drawnItems, setDrawnItems] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightedItems, setHighlightedItems] = useState([]);

  const searchPayload: SearchPayload = {
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
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(
    null
  );

  // set up the rtk-query lazy query hook
  const [searchItems, { data, error: searchError, isLoading, isFetching }] =
    useLazySearchItemsQuery();
  useHandleError(searchError, dispatch);
  useEffect(() => {
    setSearchResponse(data);
  }, [data]); //wiring the display state with rtk-query state

  // The search is always triggered when pagination changes
  useEffect(() => {
    searchItems(formatPayload(searchPayload), true);
  }, [currentPage, PAGESIZE]);

  // Otherwise, use this function to trigger search
  const handleSearchItems = () => {
    setCurrentPage(1); //every time the search triggers, set the page to start from 1
    searchItems(formatPayload(searchPayload), true);
    setCurrentTab('Result');
  };

  const handleReset = () => {
    setSelectedCollections([]);
    setDrawnItems([]);
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    setSearchResponse(null);
  };

  // // Pay attention to the order of handling different situations
  // // 1. first, deal with isLoading
  // if (isLoading) {
  //   return <CircularProgress />;
  // }

  // // 2. deal with error
  // if (searchError || !searchResponse) {
  //   return <>Error</>; //TODO: error display component
  // }

  // 2. last, deal with response result
  if (searchResponse) {
    const { features: items } = searchResponse;
    console.info(items);
  }

  const pagination = (
    <>
      <Button
        variant="contained"
        sx={{ mr: 1 }}
        startIcon={<ArrowBackIos />}
        disabled={currentPage <= 1 || isLoading || isFetching}
        onClick={() => {
          setCurrentPage((page) => page - 1);
        }}
      >
        Prev
      </Button>
      Page: {currentPage}
      <Button
        variant="contained"
        sx={{ mx: 1 }}
        endIcon={<ArrowForwardIos />}
        disabled={isLoading || isFetching}
        onClick={() => {
          setCurrentPage((page) => page + 1);
        }}
      >
        Next
      </Button>
    </>
  );

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
        <Tabs
          indicatorColor="primary"
          onChange={(event, value) => {
            setCurrentTab(value);
          }}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="fullWidth"
          sx={{
            width: '100%',
            height: `${tabHeight}px`,
            minHeight: `${tabHeight}px`,
            p: 0
          }}
        >
          <Tab
            key="Search"
            label="Search"
            value="Search"
            icon={settings.tabIcons ? <Search /> : null}
            iconPosition="start"
            sx={{
              height: '100%',
              minHeight: '100%',
              p: 0
            }}
          />
          <Tab
            key="Result"
            label="Result"
            value="Result"
            icon={settings.tabIcons ? <Dataset /> : null}
            iconPosition="start"
            sx={{
              height: '100%',
              minHeight: '100%',
              p: 0
            }}
          />
        </Tabs>
        <Box sx={{ height: `calc(100% - ${tabHeight}px)` }}>
          {isFetching && <LinearProgress />}
          {currentTab === 'Search' && (
            <Card sx={{ padding: 2, height: '100%' }}>
              <SearchQuery
                mapRef={mapRef}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setDrawnItems={setDrawnItems}
                triggerSearch={handleSearchItems}
                triggerReset={handleReset}
                selectedCollections={selectedCollections}
                setSelectedCollections={setSelectedCollections}
                setCurrentPage={setCurrentPage}
              ></SearchQuery>
            </Card>
          )}
          {currentTab === 'Result' &&
            (searchResponse?.features.length > 0 ? (
              <Card
                sx={{
                  padding: 2,
                  height: '100%',
                  overflowY: 'auto'
                }}
              >
                <Box>
                  <StacItemDisplayList
                    features={searchResponse?.features}
                    entryPoint="eodag"
                    showCollection={true}
                    highlightedItems={highlightedItems}
                    setHighlightedItems={setHighlightedItems}
                  ></StacItemDisplayList>
                </Box>
                <Box sx={{ my: 2, mx: 2 }}>{pagination}</Box>
              </Card>
            ) : (
              <Card sx={{ p: 2 }}>
                <Typography>
                  {isFetching ? `Fetching...` : `No items found.`}
                </Typography>
              </Card>
            ))}
        </Box>
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
          width: '400px',
          height: `calc(100% - ${headerHeight + 2 * marginSmall}px)`,
          overflowY: 'auto'
        }}
      >
        <RichTreeView multiSelect checkboxSelection items={productTypeTree} />
      </Box>
    </>
  );

  return (
    <>
      <Helmet>
        <title>EODAG | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          height: '100%',
          py: 0
        }}
      >
        <Container
          maxWidth={settings.compact ? 'xl' : false}
          sx={{ height: '100%', p: 0, m: 0 }}
        >
          <Grid container spacing={2} sx={{ height: '100%', p: 0, m: 0 }}>
            <Grid
              item
              md={4}
              xs={12}
              sx={{ height: '100%', pt: 0, pl: 0, m: 0 }}
            >
              <Tabs
                indicatorColor="primary"
                onChange={(event, value) => {
                  setCurrentTab(value);
                }}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="fullWidth"
                sx={{ width: '100%', p: 0 }}
              >
                <Tab
                  key="Search"
                  label="Search"
                  value="Search"
                  icon={settings.tabIcons ? <Search /> : null}
                  iconPosition="start"
                />
                <Tab
                  key="Result"
                  label="Result"
                  value="Result"
                  icon={settings.tabIcons ? <Dataset /> : null}
                  iconPosition="start"
                />
              </Tabs>
              {isFetching && <LinearProgress />}
              {currentTab === 'Search' && (
                <Card sx={{ p: 2 }}>
                  <SearchQuery
                    mapRef={mapRef}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setDrawnItems={setDrawnItems}
                    triggerSearch={handleSearchItems}
                    triggerReset={handleReset}
                    selectedCollections={selectedCollections}
                    setSelectedCollections={setSelectedCollections}
                    setCurrentPage={setCurrentPage}
                  ></SearchQuery>
                </Card>
              )}
              {currentTab === 'Result' &&
                (searchResponse?.features.length > 0 ? (
                  <Card
                    sx={{
                      mb: 2,
                      height: 'calc(100% - 112px)',
                      overflowY: 'auto'
                    }}
                  >
                    <Box>
                      <StacItemDisplayList
                        features={searchResponse?.features}
                        entryPoint="eodag"
                        showCollection={true}
                        highlightedItems={highlightedItems}
                        setHighlightedItems={setHighlightedItems}
                      ></StacItemDisplayList>
                    </Box>
                    <Box sx={{ my: 2, mx: 2 }}>{pagination}</Box>
                  </Card>
                ) : (
                  <Card sx={{ p: 2 }}>
                    <Typography>
                      {isFetching ? `Fetching...` : `No items found.`}
                    </Typography>
                  </Card>
                ))}
            </Grid>
            <Grid item md={8} xs={12} sx={{ padding: 0, m: 0 }}>
              <Box sx={{ height: '100%' }}>
                <LeafletMapComponent
                  ref={mapRef}
                  drawnItems={drawnItems}
                  setDrawnItems={setDrawnItems}
                  stacDataForDisplay={searchResponse}
                  highlightedItems={highlightedItems}
                  setHighlightedItems={setHighlightedItems}
                ></LeafletMapComponent>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default StacSearch;
