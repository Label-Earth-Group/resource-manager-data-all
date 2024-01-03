import {
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Container,
  CircularProgress,
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import { StacCollectionOverview } from 'modules/EODAG/components/StacCollectionOverview.js';
import { StacItemsBrowse } from 'modules/EODAG/components/StacItemsBrowse.tsx';
import { Info, List as ListIcon } from '@mui/icons-material';
import { ChevronRightIcon, useSettings } from 'design';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useGetCollectionsResponseQuery } from '../services/pgStacApi.ts';
import { useDispatch } from 'globalErrors';
import { useHandleError } from 'modules/EODAG/utils/utils.js';

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
          <Link underline="hover" color="textPrimary" variant="subtitle2">
            {id}
          </Link>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

const StacCollectionContent = () => {
  const entryPoint = 'repository';
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

  const { collection, error, isLoading } = useGetCollectionsResponseQuery(
    undefined,
    {
      selectFromResult: ({ data, error, isLoading }) => ({
        collection:
          data &&
          data.collections &&
          data.collections.find((collection) => collection.id === collectionID),
        error,
        isLoading
      })
    }
  );

  useHandleError(error, dispatch);
  if (error) {
    return <>Error</>;
  }

  if (isLoading) {
    return <CircularProgress />;
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
              <StacCollectionOverview
                collection={collection}
                entryPoint={entryPoint}
              />
            )}
            {currentTab === 'items' && (
              <StacItemsBrowse
                collectionID={collectionID}
                entryPoint={entryPoint}
              />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default StacCollectionContent;
