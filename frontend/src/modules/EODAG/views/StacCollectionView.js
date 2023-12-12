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
  Divider,
  CardHeader,
  CardContent
} from '@mui/material';
import Markdown from 'react-markdown';
import { Info, List } from '@mui/icons-material';
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
  const { collection } = props;
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography color="textPrimary" variant="h5">
          {collection.title && collection.title !== 'None'
            ? collection.title
            : collection.id}
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
            {collection.id}
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

function StacItemList(props) {
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
    dispatch({ type: SET_ERROR, error: error.message });
  }

  if (!items) {
    return null;
  }

  const { features, ...rest } = items;

  return (
    <Box>
      <Card sx={{ mb: 3 }}>{JSON.stringify(rest)}</Card>
      {features.map((feature) => (
        <Card key={feature.id} sx={{ mb: 3 }}>
          {JSON.stringify(feature)}
        </Card>
      ))}
    </Box>
  );
}

function StacCollectionOverview(props) {
  const { collection } = props;
  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <Card sx={{ mb: 3 }}>
          <Box>
            <CardHeader title="Description" />
            <Divider />
          </Box>
          <CardContent>
            <Typography>
              <Markdown>
                {collection.description ||
                  'No description for this collection.'}
              </Markdown>
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <Box sx={{ p: 1 }}>{JSON.stringify(collection)}</Box>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card sx={{ mb: 3 }}>
          <Box>
            <CardHeader title="Temporal extent"></CardHeader>
            <Divider />
          </Box>
          <CardContent>
            <Typography>
              From: {collection.extent?.temporal?.interval[0][0] || 'N/A'}
            </Typography>
            <Typography>
              To: {collection.extent?.temporal?.interval[0][1] || 'Present'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

const StacCollectionView = () => {
  const params = useParams();
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const collectionID = params['collectionID'];
  const [currentTab, setCurrentTab] = useState('items');

  const tabs = [
    {
      label: 'Items',
      value: 'items',
      icon: <List fontSize="small" />
    },
    { label: 'Overview', value: 'overview', icon: <Info fontSize="small" /> }
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const { data, error, isLoading } = useGetCollectionsResponseQuery(undefined, {
    selectFromResult: ({ data }) => ({
      data:
        data &&
        data.collections &&
        data.collections.filter((collection) => {
          return collection.id === collectionID;
        })
    })
  });

  const collection = data ? data[0] : null;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    console.error(error);
    dispatch({ type: SET_ERROR, error: error.message });
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
          <StacCollectionViewPageHeader collection={collection} />
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
              <StacItemList collectionID={collectionID} />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacCollectionView;
