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
import { useParams } from 'react-router';

function StacCollectionViewPageHeader(params) {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          {params.collectionID}
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
            {params.collectionID}
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

const StacCollectionView = () => {
  const params = useParams();
  const { settings } = useSettings();
  return (
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
          <StacCollectionViewPageHeader {...params} />
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          ></Box>
        </Container>
      </Box>
    </>
  );
};

export default StacCollectionView;
