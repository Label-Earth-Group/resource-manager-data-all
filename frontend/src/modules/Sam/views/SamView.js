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
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <MapContainer style={{ height: '100vh' }} zoomControl={false}>
            <MapImage />
          </MapContainer>
        </Container>
      </Box>
    </>
  );
};
export default SamView;
