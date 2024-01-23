import { Box, Container } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from 'design';
import MapImage from '../components/MapImage.tsx';
import { MapContainer } from 'react-leaflet';

const SamView = () => {
  const { settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>SAM-GEO | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          height: 'auto',
          py: 3
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <MapContainer
            style={{ height: 'calc(100vh - 108px)' }}
            zoomControl={false}
          >
            <MapImage />
          </MapContainer>
        </Container>
      </Box>
    </>
  );
};
export default SamView;
