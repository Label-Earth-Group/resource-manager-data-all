import { Link, Box, Card, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useGetCollectionItemsByCollectionIDQuery } from '../services/eodagApi.ts';
import { SET_ERROR, useDispatch } from 'globalErrors';
import { useEffect } from 'react';

export function StacItemsBrowse(props) {
  const { collectionID } = props;
  const dispatch = useDispatch();
  const {
    data: items,
    error,
    isLoading
  } = useGetCollectionItemsByCollectionIDQuery({ collectionID });

  useEffect(() => {
    if (error) {
      // Update state or dispatch action here
      console.error(error);
      dispatch({ type: SET_ERROR, error: error.error });
      return <p>ERROR</p>;
    }
  }, [error, dispatch]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!items) {
    return <></>;
  }

  const { links, features, ...rest } = items;

  return (
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
  );
}
