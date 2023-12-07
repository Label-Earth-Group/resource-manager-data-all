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
  Checkbox,
  CircularProgress
} from '@mui/material';
import { ChevronRightIcon, SearchIcon, useSettings, SearchInput } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import StacCollectionListItem from '../components/StacCollectionListItem';
import { providers } from '../constants';
import {
  EODAG_PLATFORM_INDEX,
  EODAG_PROCESSING_LEVEL_INDEX,
  EODAG_SENSOR_TYPE_INDEX,
  getCollections,
  getSummary
} from '../services/eodagApiService';
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
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [processingLevels, setProcessingLevels] = useState([]);
  const [sensorTypes, setSensorTypes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    setLoading(true);
    const fetchCollections = async () => {
      const res = await getCollections();
      setCollections(res);
      setPlatforms(getSummary(res, EODAG_PLATFORM_INDEX));
      setProcessingLevels(getSummary(res, EODAG_PROCESSING_LEVEL_INDEX));
      setSensorTypes(getSummary(res, EODAG_SENSOR_TYPE_INDEX));
    };
    fetchCollections().catch((e) =>
      dispatch({ type: SET_ERROR, error: e.message })
    );
    setLoading(false);
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

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
            </Grid>
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
};

export default StacCollectionList;
