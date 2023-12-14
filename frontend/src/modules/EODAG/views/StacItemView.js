import {
  Box,
  Card,
  Container,
  Grid,
  Divider,
  Typography,
  Breadcrumbs,
  Link,
  Tab,
  Tabs,
  CircularProgress,
  CardHeader
} from '@mui/material';
import { ChevronRightIcon, useSettings } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Info, List as ListIcon } from '@mui/icons-material';
import { useGetItemByCollectionIDAndItemIDQuery } from '../services/eodagApi.ts';
import { SET_ERROR, useDispatch } from 'globalErrors';

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
          <Link
            to={`/console/eodag/collections/${collectionID}`}
            underline="hover"
            component={RouterLink}
            color="textPrimary"
            variant="subtitle2"
          >
            {collectionID}
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

const StacItemView = () => {
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
    isLoading,
    isError
  } = useGetItemByCollectionIDAndItemIDQuery({ collectionID, itemID });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    console.error(error);
    dispatch({ type: SET_ERROR, error: JSON.stringify(error.data) });
    return <></>;
  }

  if (!item) {
    return <></>;
  }

  const { links, assets, properties, ...rest } = item;

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
                <Card sx={{ mb: 2, p: 2 }}>
                  <Typography>{JSON.stringify(rest)}</Typography>
                </Card>
                <Card sx={{ mb: 2, p: 2 }}>
                  <Typography>{JSON.stringify(properties)}</Typography>
                </Card>
              </>
            )}
            {currentTab === 'assets' && (
              <>
                {Object.keys(assets).map((k) => {
                  const linkTitle =
                    k === 'origin_assets' ? 'Origin assets' : assets[k].title;
                  return (
                    <Card id={k} sx={{ p: 2, mb: 2 }}>
                      <CardHeader title={linkTitle} />
                      <Typography>{JSON.stringify(assets[k])}</Typography>
                    </Card>
                  );
                })}
              </>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacItemView;
