import {
  Link,
  Box,
  Card,
  CircularProgress,
  Table,
  TableRow,
  TableCell,
  Button,
  Typography,
  Skeleton,
  LinearProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  getThumbnailHrefFromItem,
  //useGetCollectionItemsByCollectionIDQuery,
  useGetCollectionQueryablesByCollectionIDQuery,
  useLazySearchItemsQuery,
  formatPayload
} from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils.js';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { ImageSkeleton } from '../../../design/components/ImageSkeleton.js';
import { DateRangePicker } from './DateTimeRangePicker.js';
import React, { useEffect, useState } from 'react';
import type { Item, SearchPayload } from 'types/stac.js';

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
    console.log('search', formatPayload(searchPayload));
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
  console.log(items);

  const pagination = (
    <Typography color="textSecondary">
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
    </Typography>
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <DateRangePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <Button
          variant="contained"
          disabled={isLoading || isFetching}
          onClick={handleSearchItems}
        >
          Search Items
        </Button>
        {pagination}

        <Typography color="textSecondary">
          {Number(searchResponse.numberMatched) > 0
            ? `${searchResponse.numberMatched} item(s) found. Provided by: ${items[0]?.properties?.providers[0]?.name}`
            : 'No items found'}
        </Typography>
      </Box>
      <Card>
        {isFetching && <LinearProgress />}
        <StacItemDisplayList
          features={items}
          collectionID={collectionID}
        ></StacItemDisplayList>
      </Card>
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
              {getThumbnailHrefFromItem(feature) ? (
                <ImageSkeleton
                  src={getThumbnailHrefFromItem(feature)}
                  width={96}
                  alt="Thumbnail"
                />
              ) : (
                <Skeleton width={96} height={96} animation={false} />
              )}
            </TableCell>
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
