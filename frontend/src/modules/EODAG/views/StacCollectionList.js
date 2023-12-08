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
  //Checkbox,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, SearchIcon, useSettings, SearchInput } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import StacCollectionListItem from '../components/StacCollectionListItem';
// import { providers } from '../constants';
import {
  useGetCollectionsResponseQuery,
  EODAG_SUMMARY_INDEX,
  getSummaryFilters
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

const StacCollectionList = () => {
  const { settings } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const {
    data: collections,
    error,
    isLoading
  } = useGetCollectionsResponseQuery(undefined, {
    selectFromResult: ({ data }) => ({ data: data && data.collections })
  });
  console.info(error, isLoading, collections);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    dispatch({ type: SET_ERROR, error: error.message });
    return <p>"error"</p>;
  }

  if (collections) {
    const filters = Object.entries(EODAG_SUMMARY_INDEX).map(([filter, pos]) => (
      <Grid item md={3} sm={6} xs={12}>
        <Autocomplete
          id={filter}
          fullWidth
          options={getSummaryFilters(collections, pos)}
          renderInput={(params) => <TextField {...params} label={filter} />}
        ></Autocomplete>
      </Grid>
    ));

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
                value={inputValue}
                placeholder="Filter by name"
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {filters}
              </Grid>

              {/* <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <Autocomplete
                    id="providerFilter"
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={providers}
                    renderInput={(params) => (
                      <TextField {...params} label="EODAG provider" />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} />
                        {option.label}
                      </li>
                    )}
                  ></Autocomplete>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Autocomplete
                    id="platformFilter"
                    fullWidth
                    options={platforms}
                    onChange={() => {}}
                    renderInput={(params) => (
                      <TextField {...params} label="Platform" />
                    )}
                  ></Autocomplete>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Autocomplete
                    id="processingLevelFilter"
                    fullWidth
                    options={processingLevels}
                    renderInput={(params) => (
                      <TextField {...params} label="Processing level" />
                    )}
                  ></Autocomplete>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <Autocomplete
                    id="sensorTypeFilter"
                    fullWidth
                    options={sensorTypes}
                    renderInput={(params) => (
                      <TextField {...params} label="Sensor type" />
                    )}
                  ></Autocomplete>
                </Grid>
              </Grid> */}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              <Grid container spacing={3}>
                {collections
                  .filter((c) =>
                    c.id.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((c) => (
                    <StacCollectionListItem key={c.id} collection={c} />
                  ))}
              </Grid>
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  return <CircularProgress />;
};

export default StacCollectionList;
