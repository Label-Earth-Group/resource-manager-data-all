import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Card,
  Container,
  CircularProgress,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import StacCollectionOverview from '../components/StacCollectionOverview.js';
import { Info, List as ListIcon } from '@mui/icons-material';
import { ChevronRightIcon, useSettings } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useParams } from 'react-router';
import {
  useGetCollectionsResponseQuery,
  useGetCollectionItemsByCollectionIDQuery
} from '../services/eodagApi.ts';
import { SET_ERROR, useDispatch } from 'globalErrors';

function StacCollectionViewPageHeader(props) {
  const { title, id } = props;
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          {title && title !== 'None' ? title : id}
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
            {id}
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

function StacCollectionItemsList(props) {
  const { collectionID } = props;
  const dispatch = useDispatch();
  const {
    data: items,
    error,
    isLoading
  } = useGetCollectionItemsByCollectionIDQuery({ collectionID });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    dispatch({ type: SET_ERROR, error: error.error });
  }

  if (!items) {
    return null;
  }

  const { links, features, ...rest } = items;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>{JSON.stringify(rest)}</Card>
      {features.map((feature) => {
        return (
          <Card key={feature.id} sx={{ mb: 3, p: 2 }}>
            <Link
              component={RouterLink}
              to={`/console/eodag/collections/${collectionID}/item/${feature.id}`}
            >
              {feature.id}
            </Link>
          </Card>
        );
      })}
    </Box>
  );
}

const StacCollectionView = () => {
  const params = useParams();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const collectionID = params['collectionID'];
  const [currentTab, setCurrentTab] = useState('overview');

  const tabs = [
    { label: 'Overview', value: 'overview', icon: <Info fontSize="small" /> },
    {
      label: 'Items',
      value: 'items',
      icon: <ListIcon fontSize="small" />
    }
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const { collection, error, isError, isLoading } =
    useGetCollectionsResponseQuery(undefined, {
      selectFromResult: ({ data, error, isError, isLoading }) => ({
        collection:
          data &&
          data.collections &&
          data.collections.find((collection) => collection.id === collectionID),
        error,
        isError,
        isLoading
      })
    });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    console.error(error);
    dispatch({ type: SET_ERROR, error: 'Error loading EODAG.' });
    return <></>;
  }

  if (!collection) {
    return <></>;
  }

  return (
    <>
      <Helmet>
        <title>{collectionID} - EODAG | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <StacCollectionViewPageHeader
            title={collection.title}
            id={collection.id}
          />
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
              <StacCollectionOverview collection={collection} />
            )}
            {currentTab === 'items' && (
              <StacCollectionItemsList collectionID={collectionID} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacCollectionView;
