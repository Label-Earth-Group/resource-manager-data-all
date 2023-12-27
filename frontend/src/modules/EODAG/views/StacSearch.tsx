import {
  Button,
  Card,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Container
  //CircularProgress
} from '@mui/material';
import {
  Search,
  Dataset,
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';
import { ChevronRightIcon, useSettings } from 'design';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SearchQuery } from '../components/SearchQuery';
import { LeafletMapComponent } from '../components/MapComponent';
import { StacItemDisplayList } from '../components/StacCommonComponent.js';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils.js';
import {
  useLazySearchItemsQuery,
  formatPayload
} from '../services/eodagApi.ts';
import type { Collection, SearchPayload } from '../../../types/stac';
//import { GeoJSON as LeaflefGeoJSON } from 'leaflet';

function StacSearchPageHeader() {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          Earth Open Data API Gateway -- Search
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Images
          </Link>
          <Link
            underline="hover"
            color="textPrimary"
            component={RouterLink}
            to="/console/eodag"
            variant="subtitle2"
          >
            EODAG
          </Link>
          <Link underline="hover" color="textPrimary">
            Search
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}
console.log(StacSearchPageHeader);

const StacSearch = () => {
  const PAGESIZE = 20;
  const { settings } = useSettings();
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState('Search');

  // the search query states
  const [selectedCollections, setSelectedCollections] = useState<
    Collection[] | null
  >([]);
  const [drawnItems, setDrawnItems] = useState(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchPayload: SearchPayload = {
    page: currentPage,
    limit: PAGESIZE,
    collections: selectedCollections.map((c) => c.id),
    intersects: drawnItems?.toGeoJSON().geometry,
    dateRange:
      !startDate && !endDate
        ? undefined
        : {
            from: startDate ? startDate.toISOString() : undefined,
            to: endDate ? endDate.toISOString() : undefined
          }
  };
  console.info('search payload', searchPayload);

  // set up the rtk-query lazy query hook
  const [
    searchItems,
    { data: searchResponse, error: searchError, isLoading, isFetching }
  ] = useLazySearchItemsQuery();
  useHandleError(searchError, dispatch);
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
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container spacing={0}>
            <Grid item md={3} xs={12}>
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
                <Card>
                  <SearchQuery
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    triggerSearch={handleSearchItems}
                    selectedCollections={selectedCollections}
                    setSelectedCollections={setSelectedCollections}
                    setCurrentPage={setCurrentPage}
                  ></SearchQuery>
                </Card>
              )}
              {currentTab === 'Result' && (
                <Card>
                  {pagination}
                  <StacItemDisplayList
                    features={searchResponse?.features}
                  ></StacItemDisplayList>
                </Card>
              )}
            </Grid>
            <Grid item md={9} xs={12}>
              <LeafletMapComponent
                setDrawnItems={setDrawnItems}
                stacDataForDisplay={searchResponse}
              ></LeafletMapComponent>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default StacSearch;
