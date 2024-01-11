/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Grid,
  Card,
  CircularProgress,
  Button,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  //useGetCollectionItemsByCollectionIDQuery,
  useGetCollectionQueryablesByCollectionIDQuery as useGetCollectionQueryablesByCollectionIDQueryEODAG,
  useLazySearchItemsQuery as useLazySearchItemsQueryEODAG
} from '../services/eodagApi.ts';
import {
  //useGetCollectionItemsByCollectionIDQuery,
  useGetCollectionQueryablesByCollectionIDQuery as useGetCollectionQueryablesByCollectionIDQueryPGSTAC,
  useLazySearchItemsQuery as useLazySearchItemsQueryPGSTAC
} from '../../PGSTAC/services/pgStacApi.ts';
import { formatPayload } from '../services/stacUtils.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils/utils.js';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { DateRangePicker } from './DateTimeRangePicker.js';
import React, { useEffect, useState } from 'react';
import type { SearchPayload } from '../../../types/stac';
import { StacItemDisplayList } from './StacCommonComponent.js';
import { LeafletMapComponent } from '../components/MapComponent';

export function StacItemsBrowse({ collectionID, entryPoint = 'eodag' }) {
  const useGetCollectionQueryablesByCollectionIDQuery =
    entryPoint === 'eodag'
      ? useGetCollectionQueryablesByCollectionIDQueryEODAG
      : useGetCollectionQueryablesByCollectionIDQueryPGSTAC;
  const useLazySearchItemsQuery =
    entryPoint === 'eodag'
      ? useLazySearchItemsQueryEODAG
      : useLazySearchItemsQueryPGSTAC;
  const PAGESIZE = 20;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [drawnItems, setDrawnItems] = useState([]);
  console.info(drawnItems);

  const { data: queryables, error: errorQueryable } =
    useGetCollectionQueryablesByCollectionIDQuery(collectionID);
  useHandleError(errorQueryable, dispatch);
  const additionalFilters = queryables?.properties;
  console.info(additionalFilters);

  const [
    searchItems,
    { data: searchResponse, error: searchError, isLoading, isFetching }
  ] = useLazySearchItemsQuery();
  useHandleError(searchError, dispatch);
  console.info('isFetching', isFetching);

  // the default payload
  const searchPayload: SearchPayload = {
    collections: [collectionID],
    page: currentPage,
    limit: PAGESIZE
  };

  // The search is always triggered when pagination changes
  useEffect(() => {
    console.info('search', formatPayload(searchPayload));
    searchItems(formatPayload(searchPayload), true);
  }, [currentPage, PAGESIZE]);

  // const {
  //   data: items,
  //   error,
  //   isLoading
  // } = useGetCollectionItemsByCollectionIDQuery({ collectionID });
  // useHandleError(error, dispatch);

  const handleSearchItems = () => {
    if (!startDate && !endDate) {
      searchPayload['dateRange'] = undefined;
    } else {
      searchPayload['dateRange'] = {
        from: startDate ? startDate.toISOString() : undefined,
        to: endDate ? endDate.toISOString() : undefined
      };
    }

    searchItems(formatPayload(searchPayload), true);
  };

  // Pay attention to the order of handling different situations
  // first, deal with is Loading
  if (isLoading) {
    return <CircularProgress />;
  }

  // then, deal with error
  if (searchError || !searchResponse) {
    return <>Error</>; //TODO: error display component
  }

  // last, deal with response result
  const { features: items } = searchResponse;
  console.info(items);

  const pagination = (
    <>
      <Button
        variant="contained"
        sx={{ mr: 1 }}
        startIcon={<ArrowBackIos />}
        disabled={currentPage <= 1 || isLoading || isFetching}
        onClick={() => {
          setCurrentPage(currentPage - 1);
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
          setCurrentPage(currentPage + 1);
        }}
      >
        Next
      </Button>
    </>
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Grid container alignItems="flex-end" sx={{ mb: 2 }}>
          <Grid item>
            <DateRangePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              disabled={isLoading || isFetching}
              onClick={handleSearchItems}
              size="large"
            >
              Search Items
            </Button>
          </Grid>
        </Grid>
        <Typography color="textSecondary">
          {pagination}{' '}
          {entryPoint === 'eodag' &&
            (Number(searchResponse.numberMatched) > 0
              ? `${searchResponse.numberMatched} item(s) found. Provided by: ${items[0]?.properties?.providers[0]?.name}`
              : 'No items found')}
        </Typography>
      </Box>
      <Box>
        {isFetching && <LinearProgress />}
        <Grid container spacing={2}>
          <Grid item md={5} sm={12}>
            <Card>
              <StacItemDisplayList
                features={items}
                collectionID={collectionID}
                entryPoint={entryPoint}
                highlightBbox={(bbox) => {
                  console.info(bbox);
                }}
              ></StacItemDisplayList>
            </Card>
          </Grid>
          <Grid item md={7} sm={12}>
            <LeafletMapComponent
              setDrawnItems={setDrawnItems}
              stacDataForDisplay={searchResponse}
            ></LeafletMapComponent>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
