import {
  Button,
  Card,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  Box,
  Container
} from '@mui/material';
import {
  Search,
  Dataset,
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';
import { useSettings } from 'design';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SearchQuery } from '../components/SearchQuery';
import { LeafletMapComponent } from '../components/MapComponent';
import { StacItemDisplayList } from '../components/StacCommonComponent.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';
import { useLazySearchItemsQuery } from '../services/eodagApi.ts';
import { formatPayload } from '../services/stacUtils.ts';
import type {
  Collection,
  SearchPayload,
  SearchResponse
} from '../../../types/stac';

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

  // get the default params from react-route state
  interface LocationState {
    collections?: Collection[]; // Replace 'any' with the specific type of 'collections' if known
  }
  const location = useLocation();
  const defaultCollections =
    (location.state as LocationState)?.collections || [];

  // initialize the states
  // 1.the tab state
  const [currentTab, setCurrentTab] = useState(
    defaultCollections.length > 0 ? 'Result' : 'Search'
  );
  // 2.the search query states
  const [selectedCollections, setSelectedCollections] = useState<
    Collection[] | null
  >(defaultCollections);
  console.log(selectedCollections);
  const [drawnItems, setDrawnItems] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchPayload: SearchPayload = {
    page: currentPage,
    limit: PAGESIZE,
    collections: selectedCollections.map((c) => c.id),
    geometry: drawnItems,
    dateRange:
      !startDate && !endDate
        ? undefined
        : {
            from: startDate ? startDate.toISOString() : undefined,
            to: endDate ? endDate.toISOString() : undefined
          }
  };
  console.info('search payload', searchPayload);
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
  console.info('isFetching', isLoading, isFetching);

  // The search is always triggered when pagination changes
  useEffect(() => {
    console.info('search', formatPayload(searchPayload));
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
        <title>EODAG | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          height: '100%',
          py: 5
        }}
      >
        <Container
          maxWidth={settings.compact ? 'xl' : false}
          sx={{ height: '100%' }}
        >
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item md={4} xs={12}>
              <Tabs
                indicatorColor="primary"
                onChange={(event, value) => {
                  setCurrentTab(value);
                }}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="fullWidth"
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
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    triggerSearch={handleSearchItems}
                    triggerReset={handleReset}
                    selectedCollections={selectedCollections}
                    setSelectedCollections={setSelectedCollections}
                    setCurrentPage={setCurrentPage}
                  ></SearchQuery>
                </Card>
              )}
              {currentTab === 'Result' && (
                <Card>
                  <Box sx={{ px: 2, pt: 2 }}>{pagination}</Box>
                  <Box sx={{ pb: 2 }}>
                    <StacItemDisplayList
                      features={searchResponse?.features}
                      entryPoint="eodag"
                    ></StacItemDisplayList>
                  </Box>
                </Card>
              )}
            </Grid>
            <Grid item md={8} xs={12}>
              <Box sx={{ height: '100%' }}>
                <LeafletMapComponent
                  setDrawnItems={setDrawnItems}
                  stacDataForDisplay={searchResponse}
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
