import {
  Link,
  Box,
  Grid,
  Card,
  CircularProgress,
  Table,
  TableRow,
  TableCell,
  Button,
  Typography,
  LinearProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  //useGetCollectionItemsByCollectionIDQuery,
  useGetCollectionQueryablesByCollectionIDQuery,
  useLazySearchItemsQuery,
  formatPayload
} from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils.js';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { DateRangePicker } from './DateTimeRangePicker.js';
import React, { useEffect, useState } from 'react';
import type { Item, SearchPayload } from '../../../types/stac';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

export function StacItemsBrowse(props: { collectionID: string }) {
  const PAGESIZE = 20;
  const dispatch = useDispatch();
  const { collectionID } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const redOptions = { color: 'red' };

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
          {Number(searchResponse.numberMatched) > 0
            ? `${searchResponse.numberMatched} item(s) found. Provided by: ${items[0]?.properties?.providers[0]?.name}`
            : 'No items found'}
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
              ></StacItemDisplayList>
            </Card>
          </Grid>
          <Grid item md={7} sm={12}>
            <MapContainer
              scrollWheelZoom={true}
              id="map"
              center={[50.0, 0.0]}
              zoom={1}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GeoJSON data={searchResponse} style={redOptions}></GeoJSON>
            </MapContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function StacItemDisplayList(props: {
  features: Item[];
  collectionID: string;
}) {
  const { features, collectionID } = props;

  if (features?.length === 0) {
    return <></>;
  }

  return (
    <Table>
      {features.map((feature) => {
        return (
          <TableRow key={feature.id}>
            <TableCell>
              <Link
                component={RouterLink}
                to={`/console/eodag/collections/${collectionID}/item/${feature.id}`}
              >
                {feature.id}
              </Link>
            </TableCell>
          </TableRow>
        );
      })}
    </Table>
  );
}
