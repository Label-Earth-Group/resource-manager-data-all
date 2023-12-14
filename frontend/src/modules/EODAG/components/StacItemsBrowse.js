import { Link, Box, Card, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useGetCollectionItemsByCollectionIDQuery } from '../services/eodagApi.ts';
import { SET_ERROR, useDispatch } from 'globalErrors';

export function StacItemsBrowse(props) {
  const { collectionID } = props;
  const dispatch = useDispatch();
  const {
    data: items,
    error,
    isLoading
  } = useGetCollectionItemsByCollectionIDQuery({ collectionID });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    dispatch({ type: SET_ERROR, error: error.error });
  }

  if (!items) {
    return null;
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
