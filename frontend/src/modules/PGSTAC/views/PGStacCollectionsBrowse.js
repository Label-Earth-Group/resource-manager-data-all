import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Button,
  Container,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, useSettings, SearchInput } from 'design';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { StacCollectionListItem } from 'modules/EODAG/components/StacCollectionListItem.js';
import { useGetCollectionsResponseQuery } from '../services/pgStacApi.ts';
import { nameFilterFunc } from 'modules/EODAG/services/stacUtils.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from 'utils/utils.js';

function PGStacCollectionPageHeader() {
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
            Products
          </Link>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Box sx={{ m: -1 }}>
          <Button color="primary" sx={{ m: 1 }} variant="contained">
            Create new collection
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

const PGStacCollectionsBrowse = () => {
  const entryPoint = 'repository';
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const [nameFilter, setNameFilter] = useState('');
  // const nullFilters = Object.fromEntries(
  //   Object.keys(EODAG_SUMMARY_INDEX).map((filter) => [filter, []])
  // );
  // const [summaryFilters, setSummaryFilters] = useState(nullFilters);

  const handleInputChange = (event) => {
    setNameFilter(event.target.value);
  };
  // const handleFilterChange = (filterName) => (event, value) => {
  //   setSummaryFilters({ ...summaryFilters, [filterName]: [value] });
  // };

  const { collections, error, isLoading } = useGetCollectionsResponseQuery(
    undefined,
    {
      selectFromResult: ({ data, error, isLoading }) => ({
        collections: data && data.collections,
        error,
        isLoading
      })
    }
  ); // NOTE: should also select error and isLoading

  useHandleError(error, dispatch);
  if (error) {
    return <>Error</>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!collections) {
    return <></>;
  }

  // filter collection based on the state of filters
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
          <PGStacCollectionPageHeader />
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
                  entryPoint={entryPoint}
                  collection={c}
                  showProviders={true}
                />
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PGStacCollectionsBrowse;
