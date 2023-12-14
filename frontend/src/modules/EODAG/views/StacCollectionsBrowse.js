import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Box,
  Container,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, SearchIcon, useSettings, SearchInput } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { StacCollectionListItem } from '../components/StacCollectionListItem.js';
import {
  useGetCollectionsResponseQuery,
  EODAG_SUMMARY_INDEX,
  getSummaryFilters,
  summaryFilterFunc,
  nameFilterFunc
} from '../services/eodagApi.ts';
import { SET_ERROR, useDispatch } from 'globalErrors';

function StacCollectionPageHeader() {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          Earth Open Data API Gateway
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
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Box sx={{ m: -1 }}>
          <Button
            color="primary"
            component={RouterLink}
            startIcon={<SearchIcon fontSize="small" />}
            sx={{ m: 1 }}
            to="/console/eodag/search"
            variant="contained"
          >
            Advanced STAC search
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

const StacCollectionsBrowse = () => {
  const { settings } = useSettings();
  const [nameFilter, setNameFilter] = useState('');
  const nullFilters = Object.fromEntries(
    Object.keys(EODAG_SUMMARY_INDEX).map((filter) => [filter, []])
  );
  const [summaryFilters, setSummaryFilters] = useState(nullFilters);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setNameFilter(event.target.value);
  };
  const handleFilterChange = (filterName) => (event, value) => {
    setSummaryFilters({ ...summaryFilters, [filterName]: [value] });
  };

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

  if (collections) {
    // get the filter options from the queried collections
    const filterOptions = Object.entries(EODAG_SUMMARY_INDEX).map(
      ([filterName, pos]) => (
        <Grid item md={2} sm={4} xs={12}>
          <Autocomplete
            id={filterName}
            fullWidth
            options={getSummaryFilters(collections, pos)}
            renderInput={(params) => (
              <TextField {...params} label={filterName} />
            )}
            onChange={handleFilterChange(filterName)}
          ></Autocomplete>
        </Grid>
      )
    );

    // filter collection based on the state of filters
    const filteredCollections = collections
      .filter(summaryFilterFunc(summaryFilters))
      .filter(nameFilterFunc(nameFilter));

    return (
      <>
        <Helmet>
          <title>EODAG | data.all</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 5
          }}
        >
          <Container maxWidth={settings.compact ? 'xl' : false}>
            <StacCollectionPageHeader />
            <Box sx={{ mt: 3 }}>
              <SearchInput
                onChange={handleInputChange}
                onKeyUp={() => {}}
                value={nameFilter}
                placeholder="Filter by name"
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                {filterOptions}
              </Grid>
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
                  <StacCollectionListItem key={c.id} collection={c} />
                ))}
              </Grid>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  return <></>;
};

export default StacCollectionsBrowse;
