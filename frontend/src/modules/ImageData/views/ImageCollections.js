import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Container,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, useSettings, SearchInput } from 'design';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { StacCollectionListItem } from '../../EODAG/components/StacCollectionListItem.js';
import { useGetCollectionsQuery } from '../services/imageApi';
import { nameFilterFunc } from '../../EODAG/services/eodagApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from '../../EODAG/utils.js';

function ImageCollectionsPageHeader() {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          LabelEarth geospatial data repository
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Repository
          </Link>
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Collections
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

function ImageCollections() {
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const [nameFilter, setNameFilter] = useState('');
  const handleInputChange = (event) => {
    setNameFilter(event.target.value);
  };

  const { collections, error, isLoading } = useGetCollectionsQuery(undefined, {
    selectFromResult: ({ data, error, isLoading }) => ({
      collections: data && data.collections,
      error,
      isLoading
    })
  });

  useHandleError(error, dispatch);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!collections) {
    return <></>;
  }

  const filteredCollections = collections.filter(nameFilterFunc(nameFilter));

  return (
    <>
      <Helmet>
        <title>Image repository | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <ImageCollectionsPageHeader />
          <Box sx={{ mt: 3 }}>
            <SearchInput
              onChange={handleInputChange}
              onKeyUp={() => {}}
              value={nameFilter}
              placeholder="Filter by name"
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            <Box sx={{ pb: 2 }}>
              <Typography color="textPrimary">
                {filteredCollections.length} product(s) found.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {filteredCollections.map((c) => (
                <StacCollectionListItem
                  key={c.id}
                  entrypoint="repository"
                  collection={c}
                />
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ImageCollections;
