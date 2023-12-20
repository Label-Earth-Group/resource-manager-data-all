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
  Skeleton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  getThumbnailFromItem,
  useGetCollectionItemsByCollectionIDQuery,
  getCollectionQueryablesByCollectionID
} from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils.js';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { ImageSkeleton } from 'design/components/ImageSkeleton.js';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';

export function StacItemsBrowse(props) {
  const { collectionID } = props;
  const [currentPage] = useState(1);
  const dispatch = useDispatch();
  const {
    data: queryables,
    errorQueryable,
    isLoadingQueryable
  } = getCollectionQueryablesByCollectionID(collectionID);
  useHandleError(errorQueryable, dispatch);

  const {
    data: items,
    error,
    isLoading
  } = useGetCollectionItemsByCollectionIDQuery({ collectionID });
  useHandleError(error, dispatch);

  console.info(queryables);

  if (errorQueryable || error) {
    return <>Error</>;
  }

  if (isLoadingQueryable || isLoading) {
    return <CircularProgress />;
  }

  if (!items) {
    return <></>;
  }

  const { features } = items;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography color="textSecondary">
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            startIcon={<ArrowBackIos />}
            disabled={currentPage <= 1}
          >
            Prev
          </Button>
          Page: {currentPage}
          <Button
            variant="contained"
            sx={{ mx: 1 }}
            endIcon={<ArrowForwardIos />}
          >
            Next
          </Button>
        </Typography>
        <Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start date" />
            <DatePicker label="End date" />
          </LocalizationProvider>
        </Typography>
        <Typography color="textSecondary">
          {items.numberMatched || 0} item(s) found. Provided by:{' '}
          {features[0].properties.providers[0].name}
        </Typography>
      </Box>
      <Card>
        <Table>
          {features.map((feature) => {
            return (
              <TableRow key={feature.id}>
                <TableCell>
                  {getThumbnailFromItem(feature) ? (
                    <ImageSkeleton
                      src={getThumbnailFromItem(feature)}
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
      </Card>
    </Box>
  );
}
