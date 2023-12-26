import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Container
} from '@mui/material';
import { ChevronRightIcon, useSettings } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SearchQuery } from '../components/SearchQuery';
import { LeafletMapComponent } from '../components/MapComponent';
//import { GeoJSON as LeaflefGeoJSON } from 'leaflet';

function StacSearchPageHeader() {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          Earth Open Data API Gateway -- Search
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Images
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
          <Link underline="hover" color="textPrimary">
            Search
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

const StacSearch = () => {
  const { settings } = useSettings();

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
          <StacSearchPageHeader />

          <Grid container spacing={0}>
            <Grid item md={3} xs={12}>
              <SearchQuery></SearchQuery>
            </Grid>
            <Grid item md={9} xs={12}>
              <LeafletMapComponent></LeafletMapComponent>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default StacSearch;
