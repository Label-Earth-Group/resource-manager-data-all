import { Link, Box, Card, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetCollectionItemsByCollectionIDQuery,
  getCollectionQueryablesByCollectionID
} from '../services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../utils.js';

export function StacItemsBrowse(props) {
  const { collectionID } = props;
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

  if (errorQueryable || error) {
    return <>Error</>;
  }

  if (isLoadingQueryable || isLoading) {
    return <CircularProgress />;
  }

  if (!items) {
    return <></>;
  }
  
  queryables && {
    // get the filter options from the queried collections
    const filterOptions = Object.entries(EODAG_SUMMARY_INDEX).map(
      ([filterName, pos]) => (
        <Grid item md={2} sm={4} xs={12}>
          <Autocomplete
            id={filterName}
            fullWidth
            options={getSummaryFilters(collections, pos)}
            renderInput={(params) => <TextField {...params} label={filterName} />}
            onChange={handleFilterChange(filterName)}
          ></Autocomplete>
        </Grid>
      )
    );

  }

  const { links, features, ...rest } = items;

  return (
    <>
      

      }
      {items && (
        <Box>
          <Card sx={{ mb: 3 }}>{JSON.stringify(rest)}</Card>
          {features.map((feature) => {
            return (
              <Card key={feature.id} sx={{ mb: 3, p: 2 }}>
                <Link
                  component={RouterLink}
                  to={`/console/eodag/collections/${collectionID}/item/${feature.id}`}
                >
                  {feature.id}
                </Link>
              </Card>
            );
          })}
        </Box>
      )}
    </>
  );
}
