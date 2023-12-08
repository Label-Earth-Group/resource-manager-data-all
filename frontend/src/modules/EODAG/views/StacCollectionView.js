import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Container,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, useSettings } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useGetCollectionsResponseQuery } from '../services/eodagApi.ts';
import { SET_ERROR, useDispatch } from 'globalErrors';

function StacCollectionViewPageHeader(props) {
  const { collection } = props;
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          {collection.title}
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            External
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
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            {collection.id}
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

const StacCollectionView = () => {
  const params = useParams();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const collectionID = params['collectionID'];

  const { data, error, isLoading } = useGetCollectionsResponseQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data:
        data &&
        data.collections &&
        data.collections.filter((collection) => {
          return collection.id === collectionID;
        })
    })
  });

  const collection = data ? data[0] : null;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    dispatch({ type: SET_ERROR, error: error.message });
  }

  return collection ? (
    <>
      <Helmet>
        <title>{params.collectionID} - EODAG | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <StacCollectionViewPageHeader collection={collection} />
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            <p>{JSON.stringify(collection)}</p>
          </Box>
        </Container>
      </Box>
    </>
  ) : null;
};

export default StacCollectionView;
