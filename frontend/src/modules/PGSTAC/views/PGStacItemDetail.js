import {
  Box,
  Card,
  Button,
  Container,
  Grid,
  Divider,
  Typography,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  Table,
  TableRow,
  TableCell,
  CircularProgress
} from '@mui/material';
import { StacItemOverview } from 'modules/EODAG/components/StacItemOverview.js';
import { Info, List as ListIcon } from '@mui/icons-material';
import { ChevronRightIcon, useSettings } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useGetItemByCollectionIDAndItemIDQuery } from '../services/pgStacApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from 'modules/EODAG/utils/utils.js';

function StacItemViewPageHeader(props) {
  const { collectionID, itemID } = props;
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          {itemID}
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            Repository
          </Link>
          <Link
            underline="hover"
            color="textPrimary"
            variant="subtitle2"
            component={RouterLink}
            to="/console/repository"
          >
            Collections
          </Link>
          <Link
            to={`/console/repository/collections/${collectionID}`}
            underline="hover"
            component={RouterLink}
            color="textPrimary"
            variant="subtitle2"
          >
            {collectionID}
          </Link>
        </Breadcrumbs>
      </Grid>
      <Grid item>
        <Box sx={{ m: -1 }}>
          <Button color="secondary" sx={{ m: 1 }} variant="contained">
            Edit
          </Button>
          <Button color="error" sx={{ m: 1 }} variant="contained">
            Delete
          </Button>
          <Button color="primary" sx={{ m: 1 }} variant="contained">
            Add assets...
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

const StacItemDetail = () => {
  const params = useParams();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const { collectionID, itemID } = params;
  const [currentTab, setCurrentTab] = useState('overview');

  const tabs = [
    { label: 'Overview', value: 'overview', icon: <Info fontSize="small" /> },
    {
      label: 'Assets',
      value: 'assets',
      icon: <ListIcon fontSize="small" />
    }
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const {
    data: item,
    error,
    isLoading
  } = useGetItemByCollectionIDAndItemIDQuery({ collectionID, itemID });

  useHandleError(error, dispatch);
  if (error) {
    return <>Error</>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!item) {
    return <></>;
  }

  const { assets } = item;

  const { origin_assets, ...stac_assets } = assets;

  return (
    <>
      <Helmet>
        <title>{itemID} - EODAG | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <StacItemViewPageHeader {...params} />
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                  icon={settings.tabIcons ? tab.icon : null}
                  iconPosition="start"
                  variant="fullWidth"
                />
              ))}
            </Tabs>
          </Box>
          <Divider />
          <Box sx={{ mt: 3 }}>
            {currentTab === 'overview' && (
              <>
                <StacItemOverview item={item} />
              </>
            )}
            {currentTab === 'assets' && (
              <>
                <Card sx={{ mb: 3 }}>
                  <Table>
                    {Object.keys(stac_assets).map((k) => (
                      <TableRow>
                        <TableCell>{stac_assets[k].title || 'N/A'}</TableCell>
                        <TableCell>{stac_assets[k].href || 'N/A'}</TableCell>
                        <TableCell>{stac_assets[k].type || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </Card>
                {origin_assets && Object.keys(origin_assets).length > 0 && (
                  <Card>
                    <Box sx={{ m: 2 }}>
                      <Typography variant="h6">
                        Assets from original provider
                      </Typography>
                    </Box>
                    <Divider />
                    <Table>
                      {Object.keys(origin_assets).map((k) => (
                        <TableRow>
                          <TableCell>
                            {origin_assets[k].title || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {origin_assets[k].href || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {origin_assets[k].type || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </Card>
                )}
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacItemDetail;