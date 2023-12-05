import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Box,
  Container
} from '@mui/material';
import {
  ChevronRightIcon,
  SearchIcon,
  useSettings,
  SearchInput,
  CircularProgress
} from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import StacCollectionListItem from '../components/StacCollectionListItem';

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
  const [loading] = useState(false); // TODO
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
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
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <Box>
                <Grid container spacing={3}>
                  <StacCollectionListItem collection={{ id: 'S1_MSI_L1C' }} />
                  <StacCollectionListItem collection={{ id: 'S1_MSI_L2A' }} />
                </Grid>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacCollectionList;
