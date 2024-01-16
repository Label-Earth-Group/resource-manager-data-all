import {
  Grid,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Container,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, useSettings, SearchInput } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';
import { StacCollectionListItem } from '../components/StacCollectionListItem.js';
import { useGetCollectionsResponseQuery } from '../services/eodagApi.ts';
import {
  EODAG_SUMMARY_INDEX,
  nameFilterFunc,
  summaryFilterFunc,
  getSummaryFilters
} from '../services/stacUtils.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from 'utils/utils.js';

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
            ImageHub
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
    </Grid>
  );
}

const StacCollectionsBrowse = () => {
  const entryPoint = 'eodag';
  const { settings } = useSettings();
  const [nameFilter, setNameFilter] = useState('');
  const nullFilters = Object.fromEntries(
    Object.keys(EODAG_SUMMARY_INDEX).map((filter) => [filter, []])
  );
  const [summaryFilters, setSummaryFilters] = useState(nullFilters);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setNameFilter(event.target.value);
  };
  const handleFilterChange = (filterName) => (event, value) => {
    setSummaryFilters({ ...summaryFilters, [filterName]: [value] });
  };

  /** employ useCallback hook to memoize the function, preventing unnecessary re-renders.
   *  here should use a state modification function,
   *  so that the current state in not in dependency
   */
  const toggleCollectionChecked = useCallback(
    (collectionID, collectionTitle, checked) => {
      setSelectedCollections((prev) => {
        if (checked) {
          return [...prev, { id: collectionID, title: collectionTitle }];
        } else {
          return prev.filter((c) => c.id !== collectionID);
        }
      });
    },
    []
  );

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

  // get the filter options from the queried collections
  const filterOptions = Object.entries(EODAG_SUMMARY_INDEX).map(
    ([filterName, pos]) => (
      <Grid item key={filterName} md={2} sm={4} xs={12}>
        <Autocomplete
          key={filterName}
          id={filterName}
          fullWidth
          options={getSummaryFilters(collections, pos)}
          renderInput={(params) => <TextField {...params} label={filterName} />}
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
                {selectedCollections.length > 0 && (
                  <>
                    <RouterLink
                      to="/console/eodag/search"
                      state={{
                        collections: selectedCollections
                      }}
                    >
                      <Button sx={{ ml: 2 }} variant="contained">
                        Search within selected {selectedCollections.length}{' '}
                        collection(s)
                      </Button>
                    </RouterLink>
                    <Button
                      sx={{ ml: 2 }}
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        setSelectedCollections([]);
                      }}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {filteredCollections.map((c) => (
                <StacCollectionListItem
                  key={c.id}
                  collection={c}
                  entryPoint={entryPoint}
                  showProviders={true}
                  checked={Boolean(
                    selectedCollections.find((selected) => selected.id === c.id)
                  )}
                  toggleCollectionChecked={toggleCollectionChecked}
                />
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacCollectionsBrowse;
